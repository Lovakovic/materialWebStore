import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "./services/cart.service";
import {AuthService} from "./services/auth.service";
import {Subscription} from "rxjs";

/**
 * Root component of the application. Houses the entire app structure.
 */
@Component({
    selector: 'app-root',
    template: `
        <app-header></app-header>
        <router-outlet></router-outlet>
    `,
    styles: []
})
export class AppComponent implements OnInit, OnDestroy {
    private subscription_: Subscription = new Subscription();

    /**
     * @param authService  Service responsible for user authentication.
     * @param cartService  Service for managing shopping cart.
     */
    constructor(
        private authService: AuthService,
        private cartService: CartService) { }

    /**
     * Called when component is initialized. Checks for user authentication and initializes the cart.
     */
    ngOnInit(): void {
        this.authService.checkForLocalStorageAuth();
        this.subscription_.add(this.authService.user$.subscribe(user => {
            if(user) {
                this.cartService.init();
            }
        }))
    }

    /**
     * Called when component is destroyed. Unsubscribes from the subscription.
     */
    ngOnDestroy(): void {
        this.subscription_.unsubscribe();
    }
}
