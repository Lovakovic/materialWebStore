import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "../models/address.model";

const API_URL = `http://localhost:8081/address`;

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private _http: HttpClient) { }

  getAddresses(): Observable<Array<Address>> {
    return this._http.get<Array<Address>>(`${API_URL}`,
        { withCredentials: true });
  }

  postAddress(address: Address, newPrimary: boolean) {
    return this._http.post<HttpResponse<string>>(`${API_URL}`, { address, newPrimary },
        { withCredentials: true, observe: 'response'});
  }

  deleteAddress(id: number) {
    return this._http.delete<HttpResponse<string>>(`${API_URL}/${id}`,
        { withCredentials: true, observe:'response' })
  }
}
