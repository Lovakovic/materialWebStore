import { Injectable } from '@angular/core';
import {environment} from "../../environment/dev.environment";
import {HttpClient} from "@angular/common/http";
import {Order} from "../models/order.model";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

	constructor(private http: HttpClient) {}

	postOrder(order: Order) {
		return this.http.post<Order>(`${environment.baseUrl}/order`, order, { withCredentials: true });
	}
}
