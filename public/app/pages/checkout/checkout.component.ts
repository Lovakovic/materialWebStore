import {Component, OnInit, ViewChild} from '@angular/core';
import {AddressService} from "../../services/address.service";
import {Address} from "../../models/address.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {MatStepper} from "@angular/material/stepper";
import {PaymentOption} from "../../models/payment-option.model";
import {ReviewOrderComponent} from "./components/review-order/review-order.component";
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order.model";

@Component({
  selector: 'app-checkout',
  templateUrl: 'checkout.component.html',
  styleUrls: ['checkout.component.css']
})
export class CheckoutComponent implements OnInit {
	addresses: Array<Address> = [];
	cartItems: Array<CartItem> = [];

	shippingAddress?: Address;
	paymentOption!: PaymentOption;
	order?: Order;

	@ViewChild('stepper') stepper!: MatStepper;
	@ViewChild('reviewOrder', {static: false}) reviewOrder!: ReviewOrderComponent;

    constructor(private addressService: AddressService,
                private snackBar: MatSnackBar,
                public cartService: CartService,
				private orderService: OrderService
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

	onSelectPaymentOption(paymentOption: PaymentOption) {
		this.paymentOption = paymentOption;
		this.stepper.next();
	}

	onConfirmOrder() {
		this.stepper.next();
	}

	onPayPalOrderSubmitted(data: any) {
		// Post the transaction id to your server
		this.orderService.processPaypalPayment({ transactionId: data.id }, this.shippingAddress?.id).subscribe(response => {
			this.snackBar.open('Transaction processed successfully.', '', { duration: 3000 });
			this.order = response;
			console.log(this.order)
			this.stepper.next();
		}, error => {
			console.log(error);
		});
	}
}
