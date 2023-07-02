import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "../pages/home/home.component";
import {RegisterComponent} from "../pages/register/register.component";
import {LoginComponent} from "../pages/login/login.component";

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
		component: HomeComponent
	},
	{
		path: 'user',
		loadChildren: () => import('./user/user-routing.module').then(m => m.UserRoutingModule)
	},
	{
		path: 'admin',
		loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
