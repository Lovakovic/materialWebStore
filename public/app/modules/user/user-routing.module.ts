import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserCheckoutComponent } from "./comonents/user-checkout/user-checkout.component";
import { AuthGuard } from "../../auth.guard";
import { UserCartComponent } from "./comonents/user-cart/user-cart.component";
import { UserAddressesComponent } from "./comonents/user-addresses/user-addresses.component";
import { UserOrdersComponent } from "./comonents/user-orders/user-orders.component";
import { UserHomeComponent } from "./comonents/user-home/user-home.component";

const routes: Routes = [
	{
		path: '',
		component: UserHomeComponent
	},
	{
		path: 'home',
		component: UserHomeComponent
	},
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
		path: 'addresses',
		component: UserAddressesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'orders',
		component: UserOrdersComponent,
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class UserRoutingModule { }
