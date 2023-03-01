import {Pipe, PipeTransform} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Address} from "../models/address.model";
import {map, Observable} from "rxjs";

@Pipe({
  name: 'findPrimaryAddress'
})
export class FindPrimaryAddressPipe implements PipeTransform {

  constructor(private _authService: AuthService) {}

  transform(addresses: Array<Address>): Observable<Array<Address>> {
    return this._authService.user.pipe(
        map(user => {
          if (!user || !user.primaryAddressId) {
            return addresses || [];
          }

          const primaryAddress = addresses.find(address => address.id === user.primaryAddressId);
          const otherAddresses = addresses.filter(address => address.id !== user.primaryAddressId);
          return [primaryAddress, ...otherAddresses] as Array<Address>;
        })
    );
  }
}
