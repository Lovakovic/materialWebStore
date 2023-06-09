import {Component, OnInit, ViewChild} from '@angular/core';
import {AddressService} from "../../services/address.service";
import {Address} from "../../models/address.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {MatStepper} from "@angular/material/stepper";

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styles: [
  ]
})
export class CheckoutComponent implements OnInit {
	addresses: Array<Address> = [];
	cartItems: Array<CartItem> = [];

	shippingAddress?: Address;

	@ViewChild('stepper') stepper!: MatStepper;

    constructor(private addressService: AddressService,
                private snackBar: MatSnackBar,
                public cartService: CartService
    ) {}

	ngOnInit(): void {
		this.addressService.getAddress().subscribe(
			_addresses => this.addresses = _addresses);
		this.cartService.getCart().subscribe(
			cart => this.cartItems = cart.items);
	}

	onChooseAddress(address: Address) {
		this.shippingAddress = address;
		this.stepper.next();
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
