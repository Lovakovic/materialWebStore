import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartItem} from "../../../../models/cart.model";
import {Address} from "../../../../models/address.model";
import {PaymentOption} from "../../../../models/payment-option.model";

@Component({
  selector: 'app-review-order',
  templateUrl: 'review-order.component.html',
  styles: [
  ]
})
export class ReviewOrderComponent {
	@Input() cartItems: CartItem[] = [];
	@Input() shippingAddress?: Address;
	@Input() paymentOption?: PaymentOption;

	@Output() confirmOrder = new EventEmitter();

	get total() {
		return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
	}

	get last4Digits() {
		return this.paymentOption?.cardDetails?.cardNumber.slice(-4);
	}

	onConfirmOrder() {
		this.confirmOrder.emit();
	}
}
