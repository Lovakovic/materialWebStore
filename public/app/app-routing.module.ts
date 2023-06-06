import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {CartComponent} from "./pages/cart/cart.component";
import {RegisterComponent} from "./pages/register/register.component";
import {LoginComponent} from "./pages/login/login.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {CheckoutComponent} from "./pages/checkout/checkout.component";

const routes: Routes = [
    {
        path: 'checkout',
        component: CheckoutComponent
    },
    {
        path: 'cart',
        component: CartComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'profile',
        component: ProfileComponent
    },
    {
        path: 'home', redirectTo: '', pathMatch: "full"
    },
    {
        path: '',
        component: HomeComponent
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
