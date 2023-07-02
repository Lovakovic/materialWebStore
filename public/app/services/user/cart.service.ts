import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, switchMap, take, tap, throwError} from "rxjs";
import {Cart, CartItem} from "../../models/cart.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment/dev.environment";


@Injectable({
  providedIn: 'root'
})
export class CartService {
	private cartSubject = new BehaviorSubject<Cart>({ items: [] });
    cart$: Observable<Cart> = this.cartSubject.asObservable();

    constructor(
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) { }

    init(): void {
		this.getCart().subscribe(cart => this.updateLocalCart(cart));
    }

    getCart(): Observable<Cart> {
    	return this.http.get<Cart>(`${environment.baseUrl}/cart`, { withCredentials: true });
    }

	refreshCart(): void {
		this.http.get<Cart>(`${environment.baseUrl}/cart`, { withCredentials: true }).subscribe(cart =>
		this.cartSubject.next(cart));
	}

    deleteCart() {
    	return this.http.delete(`${environment.baseUrl}/cart`, { withCredentials: true });
    }

    patchCart(cartItem: CartItem | { productId: number, quantity: number }): Observable<void> {
    	return this.http.patch<void>(`${environment.baseUrl}/cart`, cartItem, { withCredentials: true });
    }

    updateLocalCart(cart: Cart): void {
    	this.cartSubject.next(cart);
    }

    // Increments existing or inserts new cartItem
    addToCart(item: CartItem, increment = false): Observable<Cart> {
		return this.cart$.pipe(
        	take(1),
        	switchMap(cart => {
          		const updatedItems = this.updateCartItems(cart.items, item, increment);

          		// API expects total calculated quantity of item
          		const itemToUpdate = increment && cart.items.find(_item => _item.productId === item.productId) || item;
         		const patchObservable = this.patchCart(itemToUpdate);

			    return patchObservable.pipe(
				    map(() => ({...cart, updatedItems})),
				    catchError(err => {
					  // Handle errors from patchCart() here
					  return throwError(() => err);
				    })
			    );
			}),
			tap(updatedCart => {
			  this.updateLocalCart(updatedCart);
			  this.snackBar.open('1 item added to user-cart.', '', { duration: 3000 });
			})
    	);
    }

    // Helper for `addToCart()`
    updateCartItems(items: CartItem[], updatedItem: CartItem, increment: boolean): CartItem[] {
    const itemIndex = items.findIndex(item => item.productId === updatedItem.productId);

    if(itemIndex !== -1 ) {
      if(increment) {
        items[itemIndex].quantity += 1;
      } else {
        items[itemIndex].quantity = updatedItem.quantity;
      }
    } else {
      items.push(updatedItem);
    }

    return items;
    }

    clearCart(): void {
    this.deleteCart().subscribe(() => {
      this.updateLocalCart({ items: [] });
      this.snackBar.open('Cart is cleared.', '', { duration: 3000 });
    });
    }

    getItemQuantity(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotal(cart: Cart): number {
    return cart.items.map(item => item.price * item.quantity)
        .reduce((prev, current) => prev + current, 0);
    }

    // Removes item type from user-cart
    removeFromCart(item: CartItem, update = true): Array<CartItem> {
    const filteredItems = this.cartSubject.value.items.filter(_item => _item.productId !== item.productId);

    this.patchCart({ productId: item.productId, quantity: 0 }).subscribe(() => {
      this.updateLocalCart({ items: filteredItems });
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

    let filteredItems = this.cartSubject.value.items.map((_item) => {
        if(_item.productId === item.productId) {
            _item.quantity--;

            // Check if item has to be removed from user-cart altogether
            if(_item.quantity === 0) {
            itemForRemoval = _item;
            }
      }

      return _item;
    });

        // Remove if there is no quantity of item in user-cart
        if(itemForRemoval) {
            this.removeFromCart(itemForRemoval, false);
        } else {
            this.patchCart(item).subscribe(() => {
                this.updateLocalCart({ items: filteredItems });
                this.snackBar.open(`1 item removed from cart.`, '',
                    { duration: 3000 });
            })
        }
    }
}
