import { Component, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {Address} from "../../models/address.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  addressesSubscription: Subscription | undefined;

  addresses: Array<Address> | undefined;

  constructor(
      private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getAddresses();
  }

  getAddresses(): void {
    this.addressesSubscription = this.userService.getAddresses()
        .subscribe(_addresses => this.addresses = _addresses);
  }
}
