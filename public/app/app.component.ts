import {Component, OnInit} from '@angular/core';
import {Cart} from "./models/cart.model";
import {CartService} from "./services/cart.service";
import {User} from "./models/user.model";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  template: `
    <app-header [cart]="cart" [user]="user"></app-header>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  cart: Cart = { items: [] };
  user?: User;

  constructor(
      private cartService: CartService,
      private authService: AuthService) {
  }

  ngOnInit(): void {
    // Subscribe for showing newly added items in cart
    this.cartService.cart.subscribe(_cart => {
      this.cart = _cart;
    });
    this.authService.user.subscribe(user => {
      this.user = user;
    });
  }
}
