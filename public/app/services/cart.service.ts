import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Cart, CartItem} from "../models/cart.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: []});

  constructor(
      private http: HttpClient,
      private snackBar: MatSnackBar
  ) {}

  //
  // (RAW) Server communication functions
  //
  getCart() {
    return this.http.get<Array<CartItem>>(`${environment.baseUrl}/cart`, { withCredentials: true })
  }

  deleteCart() {
    return this.http.delete(`${environment.baseUrl}/cart`, { withCredentials: true });
  }

  patchCart(cartItem: CartItem | { productId: number, quantity: number }) {
    return this.http.patch(`${environment.baseUrl}/cart`, cartItem, { withCredentials: true })
  }


  //
  // Wrapped requests
  //

  // Updates the local cart with data from server
  fetchCart() {
    this.getCart().subscribe(items => {
      if(!!items.length) {
        this.cart.next({items})
      }
    });
  }


  //
  // Event handlers
  //

  // Increments existing or inserts new cartItem
  addToCart(item: CartItem, increment = false): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find(_item => _item.productId === item.productId);

    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    // API expects total calculated quantity of item
    if(increment && itemInCart) {
      this.patchCart(itemInCart).subscribe(() => {
        this.cart.next({ items });
        this.snackBar.open('1 item added to cart.', '', { duration: 3000});
      })
    } else {
      this.patchCart(item).subscribe(() => {
        this.cart.next({ items });
        this.snackBar.open('1 item added to cart.', '', { duration: 3000});
      })
    }
  }

  getTotal(items: Array<CartItem>): number {
    return items.map(item => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.deleteCart().subscribe(() => {
      this.cart.next({ items: [] });
      this.snackBar.open('Cart is cleared.', '', { duration: 3000 });
    });
  }

  clearLocalCart(): void {
    this.cart.next({ items: [] });
  }

  // Removes item type from cart
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(_item => _item.productId !== item.productId);

    this.patchCart({ productId: item.productId, quantity: 0 }).subscribe(() => {
      this.cart.next({ items: filteredItems });
      this.snackBar.open(`${item.name} removed from cart.`, '', { duration: 3000 });

      // Alert the user via snackbar
      if(update) {
        this.snackBar.open(`1 item removed from cart.`, '', { duration: 3000 });
      }
    })

    return filteredItems;
  }

  // Decrements item amount
  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;

    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.productId === item.productId) {
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
      this.patchCart(item).subscribe(() => {
        this.cart.next({ items: filteredItems });
        this.snackBar.open(`1 item removed from cart.`, '',
            { duration: 3000 });
      })
    }
  }
}
