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
  ) {
    this.getCart().subscribe(items => {
      if(!!items.length) {
        this.cart.next({items})
      }
    });
  }

  // Server communication
  getCart() {
    return this.http.get<Array<CartItem>>(`${environment.baseUrl}/cart`, { withCredentials: true })
  }

  // Can be used to insert or update item quantity (doesn't work for removing item type from cart)
  postCart(cart: Cart) {
    return this.http.post(`${environment.baseUrl}/cart`, cart, { withCredentials: true });
  }

  // Can delete entire cart or delete product type from cart
  deleteCart(productId: number | undefined = undefined) {
    const url = `${environment.baseUrl}/cart` + (productId ? `/` + productId?.toString() : ``);
    return this.http.delete(url, { withCredentials: true });
  }

  // Event handlers
  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemInCart = items.find(_item => _item.productId === item.productId);

    if(itemInCart) {
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.postCart({ items }).subscribe(() => {
      this.cart.next({ items });
      this.snackBar.open('1 item added to cart.', '', { duration: 3000});
    });
  }

  getTotal(items: Array<CartItem>): number {
    return items
        .map(item => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.deleteCart().subscribe(() => {
      this.cart.next({ items: [] });
      this.snackBar.open('Cart is cleared.', '', { duration: 3000 });
    });
  }

  // Removes item type from cart
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cart.value.items.filter(_item => _item.productId !== item.productId);

    this.deleteCart(item.productId).subscribe(() => {
      this.cart.next({ items: filteredItems });
      this.snackBar.open(`${item.name} removed from cart.`, '', { duration: 3000 });
    });

    // Alert the user via snackbar
    if(update) {
      this.cart.next({ items: filteredItems });
      this.snackBar.open(`1 item removed from cart.`, '',
          { duration: 3000 });
    }
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
      // Decrement item amount
      this.postCart({ items: filteredItems }).subscribe(() => {
        this.cart.next({ items: filteredItems });
        this.snackBar.open(`1 item removed from cart.`, '',
            { duration: 3000 });
      })
    }
  }
}
