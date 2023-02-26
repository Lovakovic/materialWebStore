import { Pipe, PipeTransform } from '@angular/core';
import {Address} from "../models/address.model";

@Pipe({
  name: 'addressSort'
})
export class AddressSortPipe implements PipeTransform {

  transform(addresses: Array<Address> | undefined): Array<Address> | undefined {
    if(!addresses) {
      return undefined;
    }

    const sortedAddresses = [...addresses];
    sortedAddresses.sort((a: Address, b:Address) => {
      // Main address goes first
      if(a.main && !b.main) {
        return -1;
      } else if (!a.main && b.main) {
        return 1;
      }

      // Then sort by nickname asc
      if(a.nickname && b.nickname) {
        return a.nickname.localeCompare(b.nickname);
      } else if(a.nickname && !b.nickname) {
        return -1;
      } else if(!a.nickname && b.nickname) {
        return 1;
      }

      // Then by name asc
      return a.name.localeCompare(b.name);
    })

    return sortedAddresses;
  }

}
