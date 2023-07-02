import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserCheckoutComponent} from "./comonents/user-checkout/user-checkout.component";
import {AuthGuard} from "../../auth.guard";
import {UserCartComponent} from "./comonents/user-cart/user-cart.component";
import {UserAddressesComponent} from "./comonents/user-addresses/user-addresses.component";
import {UserOrdersComponent} from "./comonents/user-orders/user-orders.component";
import {UserHomeComponent} from "./comonents/user-home/user-home.component";

const routes: Routes = [
	{
		path: 'checkout',
		component: UserCheckoutComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'cart',
		component: UserCartComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'my-user-addresses',
		component: UserAddressesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'my-user-orders',
		component: UserOrdersComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'home',
		component: UserHomeComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
