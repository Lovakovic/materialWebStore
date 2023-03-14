import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Credentials} from "../models/credentials.model";
import {BehaviorSubject} from "rxjs";
import {response} from "express";
import {User} from "../models/user.model";
import {CartService} from "./cart.service";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: BehaviorSubject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);

  constructor(
      private http: HttpClient,
      private cartService: CartService
  ) {
    this.checkForLocalAuth();
  }

  get user() {
    return this._user.asObservable();
  }

  register(credentials: Credentials) {
    return this.http.post(`${environment.baseUrl}/auth/register`, credentials);
  }

  login(credentials: Credentials) {
    let loginHttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response' as 'response'
    }

    return this.http.post<HttpResponse<number>>(`${environment.baseUrl}/auth/login`, credentials, loginHttpOptions);
  }

  logout() {
    localStorage.clear();
    this.cartService.clearLocalCart();
    this._user.next(undefined);
    return this.http.get(`${environment.baseUrl}/auth/logout`, { withCredentials: true });
  }

  checkEmailAvailability(email: string) {
    return this.http.post<HttpResponse<{ taken: boolean }>>(`${environment.baseUrl}/auth/email`, { email });
  }

  getProfile() {
    return this.http.get<User>(`${environment.baseUrl}/auth/me`, { withCredentials: true });
  }

  /**
   *
   * @param user
   * @param expires
   */
  saveAuthToLocal(user: User, expires: Date) {
    this._user.next(user);
    localStorage.setItem('jwtExpiry', expires.toISOString());

    setTimeout(() => {
      this.validateTokenExpiry(expires.toISOString());
    }, expires.getTime() - new Date().getTime());
  }

  checkForLocalAuth() {
    // First check if user is already saved locally
    const jwtExpiry = localStorage.getItem('jwtExpiry');

    // If token is still valid, just refresh profile info
    if(jwtExpiry && this.validateTokenExpiry(jwtExpiry)) {
      this.getProfile().subscribe(user => this._user.next(user));
    }
  }

  /**
   * Checks whether token in local storage expired,
   * returns true if expired, else false
   * @param jwtExpiry ISO format string of expiry date
   */
  validateTokenExpiry(jwtExpiry: string): boolean {
    // If JWT is invalid we remove user and its expiry date
    if(new Date() > new Date(jwtExpiry)) {
      localStorage.removeItem('jwtExpiry');

      return false;
    }

    return true;
  }

  refreshUser(): void {
    this.getProfile().subscribe(user => this._user.next(user));
  }
}
