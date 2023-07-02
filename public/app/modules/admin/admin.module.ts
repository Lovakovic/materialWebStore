import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminOrdersComponent } from './components/order-list/admin-orders.component';
import {MatCardModule} from "@angular/material/card";
import { OrderDetailComponent } from './components/order-list/components/order-detail/order-detail.component';
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    AdminHomeComponent,
    AdminOrdersComponent,
    OrderDetailComponent
  ],
	imports: [
		CommonModule,
		AdminRoutingModule,
		MatCardModule,
		MatButtonModule,
		FormsModule,
		MatInputModule,
		MatSelectModule,
		MatIconModule
	]
})
export class AdminModule { }
