import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminOrdersComponent } from './components/order-list/admin-orders.component';
import {MatCardModule} from "@angular/material/card";
import { OrderDetailComponent } from './components/order-list/components/order-detail/order-detail.component';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import { ManageProductsComponent } from './components/manage-products/manage-products.component';
import { AddNewProductComponent } from './components/manage-products/components/add-new-product/add-new-product.component';
import {UserModule} from "../user/user.module";


@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminOrdersComponent,
    OrderDetailComponent,
    ManageProductsComponent,
    AddNewProductComponent
  ],
	imports: [
		CommonModule,
		AdminRoutingModule,
		MatCardModule,
		MatButtonModule,
		FormsModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule,
		ReactiveFormsModule,
		UserModule
	]
})
export class AdminModule { }
