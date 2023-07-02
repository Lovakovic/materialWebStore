import {Component} from '@angular/core';
import {CartService} from "../../../../services/user/cart.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-user-cart',
    templateUrl: './user-cart.component.html'
})
export class UserCartComponent {
    constructor(
        public cartService: CartService,
        public router: Router
    ) {}

    onProceedToCheckout(): void {
        this.router.navigate(['checkout']);
    }
}

