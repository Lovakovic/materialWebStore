import {Component, OnInit} from '@angular/core';
import {Cart, Product} from "../../models/cart.model";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cart: Cart = { items: [] };

  dataSource: Array<Product> = [];
  displayColumns: Array<string> = [
      'product',
      'name',
      'price',
      'quantity',
      'total',
      'action'
  ];


    constructor(private cartService: CartService) {
    }

    ngOnInit(): void {
    this.cartService.cart.subscribe((_cart: Cart) => {
        this.cart = _cart;
        this.dataSource = this.cart.items;
    })
  }

  getTotal(items: Array<Product>): number {
      return this.cartService.getTotal(items);
  }

  onClearCart(): void {
    this.cartService.clearCart()
  }

    onRemoveFromCart(item: Product): void {
        this.cartService.removeFromCart(item);
    }

    onAddQuantity(item: Product): void {
        this.cartService.addToCart(item);
    }

    onRemoveQuantity(item: Product): void {
        this.cartService.removeQuantity(item);
    }
}
