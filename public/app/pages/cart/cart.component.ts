import {Component} from '@angular/core';
import {Cart, CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent {
    displayColumns: Array<string> = [
        'product',
        'name',
        'price',
        'quantity',
        'total',
        'action'
    ];


    constructor(
        public cartService: CartService,
        public router: Router
    ) {}

    getTotal(cart: Cart): number {
        return this.cartService.getTotal(cart);
    }

    onClearCart(): void {
        this.cartService.clearCart()
    }

    onRemoveFromCart(item: CartItem): void {
        this.cartService.removeFromCart(item);
    }

    onAddQuantity(item: CartItem): void {
        this.cartService.addToCart(item);
    }

    onRemoveQuantity(item: CartItem): void {
        this.cartService.removeQuantity(item);
    }

    onProceedToCheckout(): void {
        this.router.navigate(['checkout']);
    }
}
