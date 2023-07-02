import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	// {
	// 	path: 'order-fulfillment',
	// 	component: AdminOrderFulfillmentComponent,
	// 	canActivate: [AdminGuard]
	// },
	// {
	// 	path: 'dashboard',
	// 	component: AdminDashboardComponent,
	// 	canActivate: [AdminGuard]
	// }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
