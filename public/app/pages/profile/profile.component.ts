import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Address} from "../../models/address.model";
import {AddressService} from "../../services/address.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

  addresses: Array<Address> = [];
  addressSubscription?: Subscription;
  primaryAddressIdSubscription?: Subscription;
  primaryAddressId?: number;

  constructor(
      private _addressService: AddressService,
      private _authService: AuthService,
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
    this.primaryAddressIdSubscription = this._authService.user.subscribe(user => {
        this.primaryAddressId = user.primaryAddressId;
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

    ngOnDestroy(): void {
      if(this.addressSubscription) {
          this.addressSubscription.unsubscribe();
      }
      if(this.primaryAddressIdSubscription) {
          this.primaryAddressIdSubscription.unsubscribe();
      }
    }
}
