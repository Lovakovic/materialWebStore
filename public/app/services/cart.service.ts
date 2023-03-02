import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Cart, CartItem} from "../models/cart.model";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: []});

  constructor(private _snackBar: MatSnackBar) {
    // Try to find previous cart in storage
    const savedCart = localStorage.getItem('cart');
    if(savedCart) {
      this.cart.next(JSON.parse(savedCart));
    }
  }

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];

    const itemInCart = items.find(_item => _item.id === item.id);

    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    // Save to local storage as to not lose it upon refresh
    localStorage.setItem('cart', JSON.stringify({ items }));

    // Emit the new items in cart to everyone
    this.cart.next({ items });

    // Alert the user
    this._snackBar.open('1 item added to cart.', 'OK', { duration: 3000});
  }

  getTotal(items: Array<CartItem>): number {
    return items
        .map(item => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    // Emit an empty shopping cart
    this.cart.next({ items: [] });

    // Clear local storage
    localStorage.removeItem('cart');

    // Alert the user
    this._snackBar.open('Cart is cleared.', '', { duration: 1500 });
  }

  // Removes item type from cart
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(_item => _item.id !== item.id);
    this.cart.next({ items: filteredItems });

    // Don't forget to update local storage!
    localStorage.setItem('cart', JSON.stringify({ items: filteredItems }));

    this._snackBar.open(`${item.name} removed from cart.`, 'OK', { duration: 3000 });


    if(update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open(`1 item removed from cart.`, 'OK',
          { duration: 3000 });
    }
    return filteredItems;
  }

  // Decrements item amount
  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.id === item.id) {
        _item.quantity--;

        // Check if item has to be removed from cart altogether
        if(_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }

      return _item;
    });

    // Remove if there is no quantity of item in cart
    if(itemForRemoval) {
      this.removeFromCart(itemForRemoval, false);
    } else {
      this.cart.next({ items: filteredItems });
      // Update local storage
      localStorage.setItem('cart', JSON.stringify({ items: filteredItems }));
      this._snackBar.open(`1 item removed from cart.`, 'OK',
          { duration: 3000 });
    }
  }
}
