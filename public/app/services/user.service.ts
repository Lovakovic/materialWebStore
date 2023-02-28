import { Injectable } from '@angular/core';
import {User} from "../models/user.model";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "../models/address.model";

const API_URL = `http://localhost:8081/user`;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getProfile() {
    return this.http.get<User>(`${API_URL}/me`, { withCredentials: true });
  }

  getAddresses(limit = '5', sort = 'asc'): Observable<Array<Address>> {
    return this.http.get<Array<Address>>(`${API_URL}/address?sort=${sort}&limit=${limit}`,
        { withCredentials: true });
  }

  postAddress(address: Address) {
    return this.http.post(`${API_URL}/address`, address, { withCredentials: true });
  }

  deleteAddress(id: number) {
    return this.http.delete(`${API_URL}/address/${id}`, { withCredentials: true })
  }
}
