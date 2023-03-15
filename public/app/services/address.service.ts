import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {Address} from "../models/address.model";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  getAddresses(): Observable<Array<Address>> {
    return this.http.get<Array<Address>>(`${environment.baseUrl}/address`,
        { withCredentials: true });
  }

  postAddress(address: Address, newPrimary: boolean) {
    return this.http.post<HttpResponse<string>>(`${environment.baseUrl}/address`, { address, newPrimary },
        { withCredentials: true, observe: 'response'});
  }

  deleteAddress(id: number) {
    return this.http.delete<HttpResponse<string>>(`${environment.baseUrl}/address/${id}`,
        { withCredentials: true, observe:'response' })
  }
}
