import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "./services/user/cart.service";
import {AuthService} from "./services/auth/auth.service";
import {Subscription} from "rxjs";
import {RouteStateService} from "./services/shared/route-state.service";

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

    constructor(
        private authService: AuthService,
        private cartService: CartService,
		private routeStateService: RouteStateService) { }

    ngOnInit(): void {
        this.authService.checkForLocalStorageAuth();
        this.subscription_.add(this.authService.user$.subscribe(user => {
            if(user) {
                this.cartService.init();
				this.routeStateService.loadLastRoute();
            }
        }));
		this.routeStateService.loadLastRoute();
    }

    ngOnDestroy(): void {
        this.subscription_.unsubscribe();
    }
}
