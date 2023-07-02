import {Component, Input} from '@angular/core';
import {CartItem} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
    selector: 'app-cart-items',
    templateUrl: './cart-items.component.html'
})
export class CartItemsComponent {
    displayColumns: Array<string> = [
        'product',
        'name',
        'price',
        'quantity',
        'total',
        'action'
    ];

    @Input() cartItems!: CartItem[];
	@Input() hideClearAllButton = false;

    constructor(
        public cartService: CartService
    ) {}

    getTotal(): number {
        return this.cartService.getTotal({items: this.cartItems});
    }

    onClearCart(): void {
        this.cartService.clearCart()
    }

    onRemoveFromCart(item: CartItem): void {
        this.cartService.removeFromCart(item);
    }

    onAddQuantity(item: CartItem): void {
        this.cartService.addToCart(item, true).subscribe();
    }

    onRemoveQuantity(item: CartItem): void {
        this.cartService.removeQuantity(item);
    }
}
