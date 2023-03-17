import {Component} from '@angular/core';
import {Cart} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(
      public cartService: CartService,
      public authService: AuthService,
      private router: Router,
      private snackBar: MatSnackBar
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

  onNavigateToLogin() {
    this.router.navigate(['login']);
  }

  onNavigateToProfile() {
    this.router.navigate(['profile']);
  }

  onLogout(): void {
    this.authService.logout().subscribe(() => {
      this.snackBar.open(`You've been logged out.`, '', { duration: 3000 });
      this.router.navigate(['']);
    });
  }
}
