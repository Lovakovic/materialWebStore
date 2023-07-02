import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {CartService} from "./services/user/cart.service";
import {ProductService} from "./services/shared/product.service";
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {HeaderMenuComponent} from './components/header/components/header-menu/header-menu.component';
import {CartMenuComponent} from './components/header/components/cart-menu/cart-menu.component';
import {UserModule} from "./modules/user/user.module";
import {AdminModule} from "./modules/admin/admin.module";
import {MatIconModule} from "@angular/material/icon";
import {MatBadgeModule} from "@angular/material/badge";
import {MatMenuModule} from "@angular/material/menu";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {HttpClientModule} from "@angular/common/http";
import {AuthService} from "./services/auth/auth.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [
	AppComponent,
	HeaderComponent,
	RegisterComponent,
	LoginComponent,
	HeaderMenuComponent,
  	CartMenuComponent,
  ],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		UserModule,
		AdminModule,
		MatIconModule,
		MatBadgeModule,
		MatMenuModule,
		MatToolbarModule,
		MatButtonModule,
		ReactiveFormsModule,
		MatInputModule,
		HttpClientModule,
		MatSnackBarModule
	],
  providers: [CartService, ProductService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
