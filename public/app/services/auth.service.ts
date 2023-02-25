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
  user: BehaviorSubject<User> = new BehaviorSubject<User>(noUser);

  constructor(private http: HttpClient) {
    this.checkForLocalAuth();
  }

  register(credentials: Credentials) {
    return this.http.post(`${API_URL}/register`, credentials);
  }

  checkEmailAvailability(email: string) {
    return this.http.post<HttpResponse<{ taken: boolean }>>(`${API_URL}/email`, { email });
  }

  login(credentials: Credentials) {
    let loginHttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response' as 'response'
    }

    return this.http.post<HttpResponse<any>>(`${API_URL}/login`, credentials, loginHttpOptions);
  }

  logout() {
    localStorage.clear();
    this.user.next(noUser);
    return this.http.get(`${API_URL}/logout`, { withCredentials: true });
  }

  saveAuthToLocal(user: User, expires: Date) {
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwtExpiry', expires.toISOString());

    setTimeout(() => {
      this.validateToken(expires.toISOString());
    }, expires.getTime() - new Date().getTime());
  }

  getAuthFromLocal() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      jwtExpiry: localStorage.getItem('jwtExpiry')
    };
  }

  checkForLocalAuth() {
    // First check if user is already saved locally
    const { user, jwtExpiry } = this.getAuthFromLocal();
    if(user.id && jwtExpiry && this.validateToken(jwtExpiry)) {
      this.user.next(user);
    }
  }

  /**
   * Checks whether token in local storage expired,
   * returns true if expired, else false
   * @param jwtExpiry ISO format string of expiry date
   */
  validateToken(jwtExpiry: string): boolean {
    // If JWT is invalid we remove user and its expiry date
    if(new Date() > new Date(jwtExpiry)) {
      localStorage.removeItem('user');
      localStorage.removeItem('jwtExpiry');

      return false;
    }

    return true;
  }
}
