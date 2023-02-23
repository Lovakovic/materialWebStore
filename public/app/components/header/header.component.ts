import {Component, Input} from '@angular/core';
import {Cart, CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  // Cart for displaying info about items in cart
  private _cart: Cart = { items: [] };

  // For displaying proper number on cart icon
  itemsQuantity = 0;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    // Also sum the quantity so we can display the proper number in icon
    this.itemsQuantity = cart.items
        .map(item => item.quantity)
        .reduce((prev, current) => prev + current , 0);
  }


  constructor(
      private cartService: CartService,
      private router: Router) {
  }

  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }

  navigateToLogin() {
    this.router.navigate(['login']);
  }
}
