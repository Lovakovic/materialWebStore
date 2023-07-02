import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPayPalConfig} from "ngx-paypal";
import {OrderService} from "../../../../../../../../services/shared/order.service";
import {CartItem} from "../../../../../../../../models/cart.model";
import {environment} from "../../../../../../../../../environment/dev.environment";

@Component({
	selector: 'app-paypal',
	templateUrl: './paypal.component.html'
})
export class PaypalComponent implements OnInit {
	public payPalConfig ? : IPayPalConfig;
	private showSuccess: boolean = false;
	private showCancel: boolean = false;
	private showError: boolean = false;

	@Input() orderItems!: CartItem[];
	@Output() orderDetailEmitter: EventEmitter<object> = new EventEmitter();

	constructor(private orderService: OrderService) { }

	ngOnInit(): void {
		this.initConfig();
	}

	private initConfig(): void {
		this.payPalConfig = {
			currency: 'EUR',
			clientId: environment.paypalClientId,
			createOrderOnServer: data => this.orderService.createPayPalOrder(this.orderItems)
				.toPromise().then(result => result ? result : 'fallback'),
			advanced: {
				commit: 'true'
			},
			style: {
				label: 'paypal',
				layout: 'vertical'
			},
			onApprove: (data, actions) => {
				console.log('onApprove - transaction was approved, but not authorized', data, actions);
				actions.order.get().then((details: any) => {
					console.log('onApprove - you can get full order details inside onApprove: ', details);
				});
			},
			onClientAuthorization: (data) => {
				console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
				this.showSuccess = true;
				this.emitOrderDetails(data);
			},
			onCancel: (data, actions) => {
				console.log('OnCancel', data, actions);
				this.showCancel = true;
			},
			onError: err => {
				console.log('OnError', err);
				this.showError = true;
			},
			onClick: (data, actions) => {
				console.log('onClick', data, actions);
				this.resetStatus();
			},
		};
	}

	private emitOrderDetails(orderData: any): void  {
		this.orderDetailEmitter.emit(orderData);
	}

	private resetStatus() {
		console.log('Status reset.');
	}
}
