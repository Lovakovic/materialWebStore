import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminGuard} from "./admin.guard";
import { AdminHomeComponent } from "./components/admin-home/admin-home.component";
import {AdminOrdersComponent} from "./components/order-list/admin-orders.component";
import {ManageProductsComponent} from "./components/manage-products/manage-products.component";

const routes: Routes = [
	{
		path: '',
		component: AdminHomeComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'home',
		component: AdminHomeComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'orders',
		component: AdminOrdersComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'products',
		component: ManageProductsComponent,
		canActivate: [AdminGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
