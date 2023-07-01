import { Injectable } from '@angular/core';
import {environment} from "../../environment/dev.environment";
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";
import {CartItem} from "../models/cart.model";

@Injectable({
	providedIn: 'root'
})
export class OrderService {

	constructor(private http: HttpClient) {}

	postOrder(order: Order) {
		return this.http.post<Order>(`${environment.baseUrl}/order`, order, { withCredentials: true });
	}

	createPayPalOrder(cartItems: CartItem[]) {
		return this.http.post<string>(`${environment.baseUrl}/order/create-paypal-order`, { cartItems }, { withCredentials: true });
	}

	capturePayPalOrder(orderId: string) {
		return this.http.post(`${environment.baseUrl}/order/capture-paypal-order`, { orderId }, { withCredentials: true });
	}
}
