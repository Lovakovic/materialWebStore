import {Component, OnInit} from '@angular/core';
import {Address} from "../../models/address.model";
import {AddressService} from "../../services/address.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    constructor(
        public addressService: AddressService,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.addressService.fetchAddresses();
    }

    onAddAddress(addressData: {address: Address, primary: boolean}): void {
        this.addressService.postAddress(addressData.address, addressData.primary).subscribe();
    }

    onDeleteAddress(address: Address): void {
        this.addressService.deleteAddress(address.id || -1).subscribe();
    }
}
