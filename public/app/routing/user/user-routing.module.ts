import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CheckoutComponent} from "../../pages/checkout/checkout.component";
import {AuthGuard} from "../../services/auth/auth.guard";
import {CartComponent} from "../../pages/cart/cart.component";
import {AddressesComponent} from "../../pages/addresses/addresses.component";
import {OrdersComponent} from "../../pages/orders/orders.component";

const routes: Routes = [
	{
		path: 'checkout',
		component: CheckoutComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cart',
		component: CartComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'my-addresses',
		component: AddressesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'my-orders',
		component: OrdersComponent,
		canActivate: [AuthGuard]
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
