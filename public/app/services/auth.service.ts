import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Credentials} from "../models/credentials.model";

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

  constructor(private _http: HttpClient) { }

  register(credentials: Credentials) {
    return this._http.post(`${API_URL}/register`, credentials);
  }

  checkEmailAvailability(email: string) {
    return this._http.post<HttpResponse<{ taken: boolean }>>(`${API_URL}/email`, { email });
  }

  login(credentials: Credentials) {
    return this._http.post<HttpResponse<any>>(`${API_URL}/login`, credentials, this.loginHttpOptions);
  }
}
