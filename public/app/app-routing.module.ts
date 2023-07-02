import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";

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
		path: 'user',
		loadChildren: () => import('./modules/user/user-routing.module').then(m => m.UserRoutingModule)
	},
	{
		path: 'admin',
		loadChildren: () => import('./modules/admin/admin-routing.module').then(m => m.AdminRoutingModule)
	},
	{
		path: '',
		redirectTo: 'user',
		pathMatch: 'full'
	},
	{
		path: 'home',
		redirectTo: 'user/home',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
