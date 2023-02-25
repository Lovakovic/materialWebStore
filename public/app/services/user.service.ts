import { Injectable } from '@angular/core';
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<User>(`http://localhost:8081/user/me`, { withCredentials: true });
  }
}
