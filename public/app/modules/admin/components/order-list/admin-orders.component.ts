import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../../services/shared/order.service";
import {Order} from "../../../../models/order.model";

@Component({
  selector: 'app-order-list',
  templateUrl: 'admin-orders.component.html',
  styles: [
  ]
})
export class AdminOrdersComponent implements OnInit {
	orders: Order[] = [];
	noOrders: boolean = false; // Flag to indicate if there are no orders

	constructor(private orderService: OrderService) { }

	ngOnInit(): void {
		this.orderService.getAdminOrders().subscribe({
			next: (orders: Order[]) => {
				this.orders = orders;
				this.noOrders = this.orders.length === 0;
			},
			error: (error) => {
				console.log(error);
			}
		});
	}

}
