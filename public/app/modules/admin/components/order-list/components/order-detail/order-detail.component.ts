import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OrderService} from "../../../../../../services/shared/order.service";
import {Order} from "../../../../../../models/order.model";

@Component({
  selector: 'app-order-detail',
  templateUrl: 'order-detail.component.html',
  styles: [
  ]
})
export class OrderDetailComponent {
	@Input() order!: Order;
	@Output() orderDeleted = new EventEmitter<number>();
	editMode = false;
	editedStatus = '';

	constructor(private orderService: OrderService) { }

	get billingAddress() {
		return this.order.billingStreet ?
			`${this.order.billingStreet}, ${this.order.billingCity}, ${this.order.billingCountry}` :
			`${this.order.shippingStreet}, ${this.order.shippingCity}, ${this.order.shippingCountry}`;
	}

	saveEdit() {
		this.orderService.changeOrderStatus(this.order.id, this.editedStatus).subscribe(() => {
			this.order.status = this.editedStatus;
			this.editMode = false;
		})
	}

	deleteOrder() {
		this.orderService.changeOrderStatus(this.order.id, 'deleted').subscribe(() => {
			this.order.status = 'deleted';
			this.editMode = false;
		});
	}
}
