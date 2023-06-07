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

	getAddress(): Observable<Address[]> {
		return this.http.get<Address[]>(`${environment.baseUrl}/address`, { withCredentials: true });
	}

	postAddress(address: Address) {
		return this.http.post<Address>(`${environment.baseUrl}/address`, address,
			{ withCredentials: true, observe: 'response'});
	}

	deleteAddress(id: number) {
		return this.http.delete<HttpResponse<string>>(`${environment.baseUrl}/address/${id}`,
			{ withCredentials: true, observe:'response' });
	}
}
