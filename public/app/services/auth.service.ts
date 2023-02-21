import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Credentials} from "../../models/credentials.model";

const API_URL = 'http://localhost:8081/auth/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(credentials: Credentials) {
    this.http.post(`${API_URL}/register`, credentials)
        .subscribe(res => console.log(res));
  }
}
