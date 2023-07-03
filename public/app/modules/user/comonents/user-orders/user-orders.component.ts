import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../../services/shared/order.service";
import {Order} from "../../../../models/order.model";

@Component({
  selector: 'app-user-orders',
  templateUrl: 'user-orders.component.html',
  styles: [
  ]
})
export class UserOrdersComponent implements OnInit {
	orders: Order[] = [];
	noOrders: boolean = true;

	constructor(private orderService: OrderService) { }

	ngOnInit(): void {
		this.orderService.getOrders().subscribe({
			next: (data) => {
				this.orders = data;
				this.noOrders = this.orders.length === 0;
			},
			error: (error) => {
				console.error(error);
			}
		});
	}
}
