import {Component, OnInit, ViewChild} from '@angular/core';
import {AddressService} from "../../../../services/user/address.service";
import {Address} from "../../../../models/address.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CartItem} from "../../../../models/cart.model";
import {CartService} from "../../../../services/user/cart.service";
import {MatStepper} from "@angular/material/stepper";
import {PaymentOption} from "../../../../models/payment-option.model";
import {ReviewOrderComponent} from "./components/review-order/review-order.component";
import {OrderService} from "../../../../services/shared/order.service";
import {Order} from "../../../../models/order.model";

@Component({
  selector: 'app-user-checkout',
  templateUrl: 'user-checkout.component.html',
  styleUrls: ['user-checkout.component.css']
})
export class UserCheckoutComponent implements OnInit {
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
		this.addressService.getAddresses().subscribe(
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

	onConfirmPaymentOption(paymentOption: PaymentOption) {
		this.paymentOption = paymentOption;
		const orderInfo = {
			paymentMethod: paymentOption.type,
			shippingAddress: {
				...this.shippingAddress
			}
		}

		this.orderService.postOrder(orderInfo).subscribe(_order =>  {
			console.log(_order)
			this.order = _order;
			this.stepper.next();
		});
	}

	onConfirmOrder() {
		this.stepper.next();
	}

	onPayPalOrderSubmitted(data: any) {
		// Post the transaction id to your server
		this.orderService.processPaypalPayment({ id: data.id }, this.shippingAddress?.id).subscribe({
			next: response => {
				this.snackBar.open('Transaction processed successfully.', '', { duration: 3000 });
				this.order = response;
				this.stepper.next();
			},
			error: error => {
				console.log(error);
			}
		});
	}
}
