import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Credentials} from "../models/credentials.model";
import {BehaviorSubject} from "rxjs";
import {response} from "express";
import {User} from "../models/user.model";

const API_URL = 'http://localhost:8081/auth';

const noUser = {
  id: -1,
  username: '',
  email: ''
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: BehaviorSubject<User> = new BehaviorSubject<User>(noUser);

  constructor(private http: HttpClient) {
    this.checkForLocalAuth();
  }

  get user() {
    return this._user.asObservable();
  }

  register(credentials: Credentials) {
    return this.http.post(`${API_URL}/register`, credentials);
  }

  login(credentials: Credentials) {
    let loginHttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response' as 'response'
    }

    return this.http.post<HttpResponse<number>>(`${API_URL}/login`, credentials, loginHttpOptions);
  }

  logout() {
    localStorage.clear();
    this._user.next(noUser);
    return this.http.get(`${API_URL}/logout`, { withCredentials: true });
  }

  checkEmailAvailability(email: string) {
    return this.http.post<HttpResponse<{ taken: boolean }>>(`${API_URL}/email`, { email });
  }

  getProfile() {
    return this.http.get<User>(`${API_URL}/me`, { withCredentials: true });
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
