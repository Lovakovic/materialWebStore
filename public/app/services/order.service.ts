import { Injectable } from '@angular/core';
import {environment} from "../../environment/dev.environment";
import {HttpClient} from "@angular/common/http";
import {Order, PayPalTransaction} from "../models/order.model";
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

	processPaypalPayment(newPaypalTransaction: PayPalTransaction) {
		return this.http.post<Order>(`${environment.baseUrl}/order/process-paypal-payment`, newPaypalTransaction, { withCredentials: true });
	}
}
