import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../services/order.service";
import {Order} from "../../models/order.model";

@Component({
  selector: 'app-orders',
  templateUrl: 'orders.component.html',
  styles: [
  ]
})
export class OrdersComponent implements OnInit {
	orders: Order[] = [];

	constructor(private orderService: OrderService) { }

	ngOnInit(): void {
		this.orderService.getOrders().subscribe(data => {
			console.log(data)
			this.orders = data;
		}, error => {
			console.error(error);
		});
	}
}
