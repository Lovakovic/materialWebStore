import { Injectable } from '@angular/core';
import {environment} from "../../../environment/dev.environment";
import {HttpClient} from "@angular/common/http";
import {Order, PayPalTransaction} from "../../models/order.model";
import {CartItem} from "../../models/cart.model";
import {CartService} from "../user/cart.service";
import {Observable, tap} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class OrderService {

	constructor(private http: HttpClient,
				private cartService: CartService) {}

	postOrder(order: any) {
		return this.http.post<Order>(`${environment.baseUrl}/order`, order, { withCredentials: true })
			.pipe(tap(() => this.cartService.refreshCart()));
	}

	getOrders() {
		return this.http.get<Order[]>(`${environment.baseUrl}/order`, { withCredentials: true });
	}

	changeOrderStatus(orderId: number, newStatus: string) {
		return this.http.put(`${environment.baseUrl}/order/status`, { orderId, newStatus }, { withCredentials: true })
	}

	getAdminOrders(): Observable<any> {
		return this.http.get(`${environment.baseUrl}/order/all`, { withCredentials: true });
	}

	createPayPalOrder(cartItems: CartItem[]) {
		return this.http.post<string>(`${environment.baseUrl}/order/create-paypal-order`, { cartItems }, { withCredentials: true });
	}

	processPaypalPayment(newPaypalTransaction: PayPalTransaction, shippingAddressId?: number) {
		return this.http.post<Order>(`${environment.baseUrl}/order/process-paypal-payment`,
			{ transactionId: newPaypalTransaction.id, shippingAddressId
			}, { withCredentials: true })
			.pipe(tap(() => this.cartService.refreshCart()));
	}
}
