import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Credentials} from "../../models/credentials.model";

const API_URL = 'http://localhost:8081/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(credentials: Credentials) {
    return this.http.post(`${API_URL}/register`, credentials);
  }

  checkEmailAvailability(email: string) {
    return this.http.post<HttpResponse<{ taken: boolean }>>(`${API_URL}/email`, { email });
  }
}
