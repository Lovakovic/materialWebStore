import { Component } from '@angular/core';
import {Cart} from "../../../../models/cart.model";
import {CartService} from "../../../../services/user/cart.service";

@Component({
  selector: 'app-user-cart-menu',
  templateUrl: 'cart-menu.component.html'
})
export class CartMenuComponent {
	constructor(
		public cartService: CartService
	) { }

	getItemQuantity(cart: Cart): number {
		return this.cartService.getItemQuantity(cart);
	}

	getTotal(cart: Cart): number {
		return this.cartService.getTotal(cart);
	}

	onClearCart(): void {
		this.cartService.clearCart();
	}
}
