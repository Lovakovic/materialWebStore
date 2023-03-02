import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatMenuModule} from "@angular/material/menu";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatListModule} from "@angular/material/list";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTableModule} from "@angular/material/table";
import {MatBadgeModule} from "@angular/material/badge";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductsHeaderComponent } from './pages/home/components/products-header/products-header.component';
import { FiltersComponent } from './components/filters/filters.component';
import { ProductBoxComponent } from './pages/home/components/product-box/product-box.component';
import { CartComponent } from './pages/cart/cart.component';
import {CartService} from "./services/cart.service";
import {StoreService} from "./services/store.service";
import {HttpClientModule} from "@angular/common/http";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatRadioModule} from "@angular/material/radio";
import { RegisterComponent } from './pages/register/register.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddressBoxComponent } from './pages/profile/components/address-box/address-box.component';
import { ProfileHeaderComponent } from './pages/profile/components/profile-header/profile-header.component';
import { NewAddressComponent } from './components/new-address/new-address.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { FindPrimaryAddressPipe } from './pipes/find-primary-address.pipe';
import { TrimDirective } from './directives/trim.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ProductsHeaderComponent,
    FiltersComponent,
    ProductBoxComponent,
    CartComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    AddressBoxComponent,
    ProfileHeaderComponent,
    NewAddressComponent,
    FindPrimaryAddressPipe,
    TrimDirective
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatGridListModule,
        MatMenuModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatExpansionModule,
        MatListModule,
        MatToolbarModule,
        MatTableModule,
        MatBadgeModule,
        MatSnackBarModule,
        HttpClientModule,
        MatButtonToggleModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatCheckboxModule
    ],
  providers: [CartService, StoreService],
  bootstrap: [AppComponent]
})
export class AppModule { }
