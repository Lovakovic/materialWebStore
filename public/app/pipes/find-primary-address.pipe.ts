import {Pipe, PipeTransform} from '@angular/core';
import {Address} from "../models/address.model";
import {User} from "../models/user.model";

@Pipe({
  name: 'findPrimaryAddress'
})
export class FindPrimaryAddressPipe implements PipeTransform {
  transform(addresses: Array<Address>, user: User): Address[] {
      if (!user || !user.primaryAddressId || !addresses) {
          return addresses || [];
      }

      const primaryAddress = addresses.find(address => address.id === user.primaryAddressId);
      const otherAddresses = addresses.filter(address => address.id !== user.primaryAddressId);

      if(primaryAddress) {
          return [primaryAddress, ...otherAddresses];
      } else {
          return otherAddresses;
      }
  }
}
