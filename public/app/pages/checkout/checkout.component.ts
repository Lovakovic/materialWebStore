import {Component, OnInit} from '@angular/core';
import {AddressService} from "../../services/address.service";
import {AuthService} from "../../services/auth.service";
import {Address} from "../../models/address.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styles: [
  ]
})
export class CheckoutComponent implements OnInit {
	addresses: Array<Address> = [];

    constructor(public addressService: AddressService,
                private snackBar: MatSnackBar) {
    }

	ngOnInit(): void {
		this.addressService.getAddress().subscribe(
			_addresses => this.addresses = _addresses);
	}

	onChooseAddress(address: Address) {
		// Implement checkout service and post the chosen address here
	}

	onAddAddress(address: Address) {
		this.addressService.postAddress(address).subscribe(
			res => {
				if(res.body) {
					this.addresses.push(res.body)
					this.snackBar.open('Address added successfully.', '', { duration: 3000})
				} else {
					this.snackBar.open('Something went wrong.', '', { duration: 3000})
				}
			}
		);
	}
}
