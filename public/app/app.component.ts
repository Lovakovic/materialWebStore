import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "./services/cart.service";
import {AuthService} from "./services/auth.service";
import {Subscription} from "rxjs";

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
      private cartService: CartService) { }

    ngOnInit(): void {
      this.authService.checkForLocalStorageAuth();
      this.subscription_.add(this.authService.user$.subscribe(user => {
          if(user) {
              this.cartService.init();
          }
      }))
    }

    ngOnDestroy(): void {
        this.subscription_.unsubscribe();
    }
}
