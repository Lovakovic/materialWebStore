import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserHomeComponent} from "./modules/user/comonents/user-home/user-home.component";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginComponent} from "./pages/login/login.component";

const routes: Routes = [
	{
		path: 'register',
		component: RegisterComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'home',
		redirectTo: '',
		pathMatch: "full"
	},
	{
		path: '',
		component: UserHomeComponent
	},
	{
		path: 'user',
		loadChildren: () => import('./modules/user/user-routing.module').then(m => m.UserRoutingModule)
	},
	{
		path: 'admin',
		loadChildren: () => import('./modules/admin/admin-routing.module').then(m => m.AdminRoutingModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
