import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserHomeComponent} from "./comonents/user-home/user-home.component";
import {ProductsHeaderComponent} from "./comonents/user-home/components/products-header/products-header.component";
import {FiltersComponent} from "./comonents/user-home/components/filters/filters.component";
import {ProductBoxComponent} from "./comonents/user-home/components/product-box/product-box.component";
import {UserCartComponent} from "./comonents/user-cart/user-cart.component";
import {UserAddressBoxComponent} from "./comonents/user-address-box/user-address-box.component";
import {UserNewAddressComponent} from "./comonents/user-new-address/user-new-address.component";
import {TrimDirective} from "../../directives/trim.directive";
import {UserCheckoutComponent} from "./comonents/user-checkout/user-checkout.component";
import {UserCartItemsComponent} from "./comonents/user-cart-items/user-cart-items.component";
import {PaymentFormComponent} from "./comonents/user-checkout/components/payment-form/payment-form.component";
import {ReviewOrderComponent} from "./comonents/user-checkout/components/review-order/review-order.component";
import {PaypalComponent} from "./comonents/user-checkout/components/payment-form/components/paypal/paypal.component";
import {OrderSuccessComponent} from "./comonents/user-checkout/components/order-success/order-success.component";
import {UserAddressesComponent} from "./comonents/user-addresses/user-addresses.component";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {NgxPayPalModule} from "ngx-paypal";
import {MatStepperModule} from "@angular/material/stepper";
import {MatRadioModule} from "@angular/material/radio";
import {MatMenuModule} from "@angular/material/menu";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTableModule} from "@angular/material/table";
import {UserOrdersComponent} from "./comonents/user-orders/user-orders.component";


@NgModule({
  declarations: [
	  UserHomeComponent,
	  ProductsHeaderComponent,
	  FiltersComponent,
	  ProductBoxComponent,
	  UserCartComponent,
	  UserAddressBoxComponent,
	  UserNewAddressComponent,
	  TrimDirective,
	  UserCheckoutComponent,
	  UserCartItemsComponent,
	  PaymentFormComponent,
	  ReviewOrderComponent,
	  PaypalComponent,
	  OrderSuccessComponent,
	  UserAddressesComponent,
	  UserOrdersComponent
  ],
	imports: [
		CommonModule,
		UserRoutingModule,
		MatExpansionModule,
		MatButtonModule,
		MatListModule,
		MatIconModule,
		MatCardModule,
		MatInputModule,
		ReactiveFormsModule,
		MatSelectModule,
		NgxPayPalModule,
		MatStepperModule,
		MatRadioModule,
		MatMenuModule,
		MatSidenavModule,
		MatGridListModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatTableModule
	]
})
export class UserModule { }
