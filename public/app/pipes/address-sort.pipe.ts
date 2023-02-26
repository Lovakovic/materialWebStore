import { Pipe, PipeTransform } from '@angular/core';
import {Address} from "../models/address.model";

@Pipe({
  name: 'addressSort'
})
/**
 * Puts the main address first, changes nothing else
 */
export class AddressSortPipe implements PipeTransform {

  transform(addresses: Array<Address> | undefined): Array<Address> | undefined {
    if(!addresses) {
      return undefined;
    }

    const sortedAddresses = [...addresses];
    sortedAddresses.sort((a: Address, b:Address) => {
      if(a.main && !b.main) {
        return -1;
      } else if (!a.main && b.main) {
        return 1;
      }

      return 0;
    })

    return sortedAddresses;
  }

}
