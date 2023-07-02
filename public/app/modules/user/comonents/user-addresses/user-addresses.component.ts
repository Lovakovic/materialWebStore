import { Component } from '@angular/core';
import {Address} from "../../../../models/address.model";
import {AddressService} from "../../../../services/user/address.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-user-addresses',
  templateUrl: 'user-addresses.component.html'
})
export class UserAddressesComponent {
	addresses: Array<Address> = [];

	constructor(
		private addressService: AddressService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.addressService.getAddresses().subscribe(
			_addresses => this.addresses = _addresses
		);
	}

	onAddAddress(address: Address): void {
		this.addressService.postAddress(address).subscribe(
			response => {
				if(response.body) {
					this.addresses.push(response.body);
					this.snackBar.open('Address added.', '', { duration: 3000 });
				} else {
					this.snackBar.open('Something went wrong.', '', { duration: 3000 });
				}
			}
		);
	}

	onDeleteAddress(address: Address): void {
		this.addressService.deleteAddress(address.id ?? -1).subscribe( res => {
			if(res.status === 204) {
				this.addresses = this.addresses.filter(_address => _address != address);
				this.snackBar.open('Address deleted.', '', { duration: 3000 });
			} else {
				this.snackBar.open('Something went wrong.', '', { duration: 3000 });
			}
		});
	}
}
