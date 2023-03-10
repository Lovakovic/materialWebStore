import {Component, Input, OnInit} from '@angular/core';
import {Cart, CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit{
  // Cart for displaying info about items in cart
  private _cart: Cart = { items: [] };

  // For displaying proper number on cart icon
  itemsQuantity = 0;
  private _user?: User;

  @Input()
  get cart(): Cart {
    return this._cart;
  }

  set cart(cart: Cart) {
    this._cart = cart;

    // Also sum the quantity, so we can display the proper number in icon
    this.itemsQuantity = cart.items
        .map(item => item.quantity)
        .reduce((prev, current) => prev + current , 0);
  }

  @Input()
  get user(): User | undefined {
    return this._user;
  }

  set user(user: User | undefined) {
    this._user = user;
  }

  constructor(
      private _cartService: CartService,
      private _router: Router,
      private _auth: AuthService,
      private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this._auth.user.subscribe(user => this._user = user);
  }

  getTotal(items: Array<CartItem>): number {
    return this._cartService.getTotal(items);
  }

  onClearCart(): void {
    this._cartService.clearCart();
  }

  onNavigateToLogin() {
    this._router.navigate(['login']);
  }

  onNavigateToProfile() {
    this._router.navigate(['profile']);
  }

  onLogout(): void {
    this._auth.logout().subscribe(() => {
      this._snackBar.open(`You've been logged out.`, '', { duration: 3000 });
      this._router.navigate(['']);
    });
  }
}
