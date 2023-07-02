import {Component, Input} from '@angular/core';
import {Order} from "../../../../../../models/order.model";

@Component({
  selector: 'app-order-success',
  templateUrl: 'order-success.component.html',
  styles: [
  ]
})
export class OrderSuccessComponent {
	@Input() order?: Order;
}
