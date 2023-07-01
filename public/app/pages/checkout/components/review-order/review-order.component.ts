import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CartItem} from "../../../../models/cart.model";
import {Address} from "../../../../models/address.model";
import {PaymentOption} from "../../../../models/payment-option.model";

@Component({
  selector: 'app-review-order',
  templateUrl: 'review-order.component.html',
  styles: [
	  ' p { margin-bottom: 0.3rem }'
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

	get infoComplete() {
		return (this.cartItems.length > 0) &&
			this.shippingAddress != undefined;
	}

	onConfirmOrder() {
		this.confirmOrder.emit();
	}
}
