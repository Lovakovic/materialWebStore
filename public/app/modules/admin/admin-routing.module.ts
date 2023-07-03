import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminGuard} from "./admin.guard";
import { AdminHomeComponent } from "./components/admin-home/admin-home.component";
import {AdminOrdersComponent} from "./components/order-list/admin-orders.component";
import {ManageProductsComponent} from "./components/manage-products/manage-products.component";
import {UsersListComponent} from "./components/user-list/users-list.component";
import {UserDetailsComponent} from "./components/user-list/components/user-details/user-details.component";

const routes: Routes = [
	{
		path: '',
		component: AdminOrdersComponent,
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
	},
	{
		path: 'user-list',
		component: UsersListComponent,
		canActivate: [AdminGuard]
	},
	{
		path: 'user-list/:id',
		component: UserDetailsComponent,
		canActivate: [AdminGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule { }
