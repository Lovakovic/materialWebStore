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
    // First check if user is already saved locally
    const localInfo = this.getUserFromLocal();
    if(localInfo.id) {
      this.user.next(localInfo);
    }
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

  saveUserToLocal(user: User) {
    this.user.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocal() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
