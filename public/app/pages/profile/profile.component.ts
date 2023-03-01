import { Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Address} from "../../models/address.model";
import {AddressService} from "../../services/address.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  addresses: Array<Address> | undefined;
  addressSubscription: Subscription | undefined;

  constructor(
      private _addressService: AddressService,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses(): void {
    this.addressSubscription = this._addressService.getAddresses()
        .subscribe(_addresses => {
          this.addresses = _addresses
        });
  }

  onAddAddress(addressData: {address: Address, primary: boolean}): void {
      this._addressService.postAddress(addressData.address, addressData.primary)
          .subscribe(res => {
              if(res.status === 200) {
                  this._snackBar.open('Address added.', '', { duration: 1500 });
                  this.getAddresses();
              }
          });
  }

  onDeleteAddress(address: Address): void {
    this._addressService.deleteAddress(address.id || -1)
        .subscribe(res => {
          if(res.status === 200) {
            this._snackBar.open('Address deleted.', '', { duration: 1500 });
            this.getAddresses();
          }
        });
  }
}
