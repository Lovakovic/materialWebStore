import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Credentials} from "../models/credentials.model";
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {response} from "express";
import {User} from "../models/user.model";
import {CartService} from "./cart.service";
import {environment} from "../../environment/dev.environment";

/**
 * A service providing authentication functionality including register, login, logout, and profile fetching.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | undefined>(undefined);
  user$: Observable<User | undefined> = this.userSubject.asObservable();

    /**
     * @param http HttpClient used for making HTTP requests.
     * @param cartService Service for managing shopping cart.
     */
  constructor(
      private http: HttpClient,
      private cartService: CartService
  ) {}

    /**
     * Register a new user.
     *
     * @param credentials Object with user credentials.
     * @returns Observable of the server response, maps to boolean if the request was successful.
     */
    register(credentials: Credentials): Observable<boolean> {
    return this.http.post<HttpResponse<string>>(`${environment.baseUrl}/auth/register`, credentials,
        { observe: 'response'})
        .pipe(map(res => res.status === 200));
    }

    /**
     * Login user.
     *
     * @param credentials Object with user credentials.
     * @returns Observable of the server response, maps to boolean if the login was successful.
     */
    login(credentials: Credentials): Observable<boolean> {
    let loginHttpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        withCredentials: true,
        observe: 'response' as 'response'
    };
        let tokenExpires: Date;

        return this.http
            .post<HttpResponse<number>>(`${environment.baseUrl}/auth/login`, credentials, loginHttpOptions)
            .pipe(
                switchMap((res: HttpResponse<any>) => {
                    tokenExpires = new Date(res.body);
                    return this.getProfile().pipe(
                        tap((user: User) => {
                            console.log(`Your login expires at ${tokenExpires.toString()}`);
                            this.saveAuthToLocalStorage(user, tokenExpires);
                        }),
                        map(() => true)
                    );
                }),
                catchError(() => {
                    return of(false)
                })
          );
    }

    /**
     * Logout user and clear all user data.
     *
     * @returns Observable of the server response for the logout request.
     */
    logout() {
    localStorage.clear();
    this.cartService.updateLocalCart({ items: [] });
        this.updateLocalUser(undefined);
        return this.http.get(`${environment.baseUrl}/auth/logout`, { withCredentials: true });
    }

    /**
     * Check if email is available for registration.
     *
     * @param email Email to check.
     * @returns Observable of the server response.
     */
    checkEmailAvailability(email: string) {
        return this.http.post<HttpResponse<{ taken: boolean }>>(`${environment.baseUrl}/auth/email`, { email });
    }

    /**
     * Fetch the user's profile data.
     *
     * @returns Observable of the user's profile data.
     */
    getProfile() {
        return this.http.get<User>(`${environment.baseUrl}/auth/me`, { withCredentials: true });
    }

    /**
     * Update the locally stored user data.
     *
     * @param user Updated user data.
     */
    updateLocalUser(user: User | undefined) {
       this.userSubject.next(user);
    }

    saveAuthToLocalStorage(user: User, expires: Date) {
        this.updateLocalUser(user);
        localStorage.setItem('jwtExpiry', expires.toISOString());

        setTimeout(() => {
            this.validateJwtExpiry(expires.toISOString());
        }, expires.getTime() - new Date().getTime());
    }

    checkForLocalStorageAuth() {
        // First check if user is already saved locally
        const jwtExpiry = localStorage.getItem('jwtExpiry');

        // If token is still valid, just refresh profile info
        if(jwtExpiry && this.validateJwtExpiry(jwtExpiry)) {
            this.getProfile().subscribe(user => this.updateLocalUser(user));
        }
    }

    validateJwtExpiry(jwtExpiry: string): boolean {
        // If JWT is invalid we remove user and its expiry date
        if(new Date() > new Date(jwtExpiry)) {
            localStorage.removeItem('jwtExpiry');

            return false;
        }

        return true;
    }

    refreshUser(): void {
        this.getProfile().subscribe(user => this.updateLocalUser(user));
    }
}
