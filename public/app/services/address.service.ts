import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "../models/address.model";

const API_URL = `http://localhost:8081/user`;

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private _http: HttpClient) { }

  getAddresses(limit?: string, sort?: string): Observable<Array<Address>> {
    return this._http.get<Array<Address>>(`${API_URL}/address?sort=${sort}&limit=${limit}`,
        { withCredentials: true });
  }

  postAddress(address: Address, newPrimary: boolean) {
    return this._http.post<HttpResponse<string>>(`${API_URL}/address`, { address, newPrimary },
        { withCredentials: true, observe: 'response'});
  }

  deleteAddress(id: number) {
    return this._http.delete<HttpResponse<string>>(`${API_URL}/address/${id}`,
        { withCredentials: true, observe:'response' })
  }
}
