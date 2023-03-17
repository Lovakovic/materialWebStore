import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {Address} from "../models/address.model";
import {environment} from "../../environment/environment";
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private addressesSubject = new BehaviorSubject<Address[]>([]);
  addresses$: Observable<Address[]> = this.addressesSubject.asObservable();

  constructor(
      private http: HttpClient,
      private authService: AuthService,
      private snackBar: MatSnackBar
  ) { }

  fetchAddresses(): void {
    this.http.get<Address[]>(`${environment.baseUrl}/address`, { withCredentials: true })
        .subscribe(addresses => this.addressesSubject.next(addresses));
  }

  postAddress(address: Address, newPrimary: boolean) {
    return this.http.post<HttpResponse<string>>(`${environment.baseUrl}/address`, { address, newPrimary },
        { withCredentials: true, observe: 'response'})
        .pipe(
            tap(res => {
                if (res.status === 200) {
                    this.snackBar.open('Address added.', '', { duration: 3000 });

                    if (newPrimary) {
                        this.authService.refreshUser();
                    }

                    this.fetchAddresses();
                }  else {
                    this.snackBar.open('Something went wrong.', '', { duration: 3000 });
                }
            })
        );
  }

  deleteAddress(id: number) {
    return this.http.delete<HttpResponse<string>>(`${environment.baseUrl}/address/${id}`,
        { withCredentials: true, observe:'response' })
        .pipe(
            tap(res => {
                if (res.status === 200) {
                    this.snackBar.open('Address deleted.', '', { duration: 3000 });
                    this.fetchAddresses();
                } else {
                    this.snackBar.open('Something went wrong.', '', { duration: 3000 });
                }
            })
        );
  }
}
