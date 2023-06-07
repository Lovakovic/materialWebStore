import {Component, OnInit} from '@angular/core';
import {Address} from "../../models/address.model";
import {AddressService} from "../../services/address.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
	addresses: Array<Address> = [];

    constructor(public addressService: AddressService) { }

	ngOnInit(): void {
		this.addressService.getAddress().subscribe(_addresses =>
			this.addresses = _addresses);
	}

    onAddAddress(addressData: {address: Address, primary: boolean}): void {
        this.addressService.postAddress(addressData.address, addressData.primary).subscribe();
    }

    onDeleteAddress(address: Address): void {
        this.addressService.deleteAddress(address.id || -1).subscribe();
    }
}
