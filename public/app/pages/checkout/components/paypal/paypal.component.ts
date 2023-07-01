import {Component, Input, OnInit} from '@angular/core';
import {IPayPalConfig} from "ngx-paypal";
import {OrderService} from "../../../../services/order.service";
import {CartItem} from "../../../../models/cart.model";

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

	constructor(private orderService: OrderService) { }

	ngOnInit(): void {
		this.initConfig();
	}

	private initConfig(): void {
		this.payPalConfig = {
			currency: 'EUR',
			clientId: 'sb',
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

	private resetStatus() {
		console.log('Status reset.');
	}
}
