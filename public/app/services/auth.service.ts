import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Credentials} from "../models/credentials.model";
import {BehaviorSubject} from "rxjs";
import {response} from "express";
import {User} from "../models/user.model";

const API_URL = 'http://localhost:8081/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginHttpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
    observe: 'response' as 'response'
  }
  user: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: -1,
    username: '',
    email: ''
  });

  constructor(private http: HttpClient) {
    this.checkLocalForUser();
  }

  register(credentials: Credentials) {
    return this.http.post(`${API_URL}/register`, credentials);
  }

  checkEmailAvailability(email: string) {
    return this.http.post<HttpResponse<{ taken: boolean }>>(`${API_URL}/email`, { email });
  }

  login(credentials: Credentials) {
    return this.http.post<HttpResponse<any>>(`${API_URL}/login`, credentials, this.loginHttpOptions);
  }

  getProfile() {
    return this.http.get<User>(`${API_URL}/usr`, { withCredentials: true });
  }

  saveUserToLocal(user: User, expires: Date) {
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('jwtExpiry', expires.toISOString());

    setTimeout(() => {
      this.validateToken(expires.toISOString());
    }, expires.getTime() - new Date().getTime());
  }

  getDataFromLocal() {
    return {
      user: JSON.parse(localStorage.getItem('user') || '{}'),
      jwtExpiry: localStorage.getItem('jwtExpiry')
    };
  }

  checkLocalForUser() {
    // First check if user is already saved locally
    const { user, jwtExpiry } = this.getDataFromLocal();
    if(user.id && jwtExpiry && this.validateToken(jwtExpiry)) {
      this.user.next(user);
    }
  }

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
