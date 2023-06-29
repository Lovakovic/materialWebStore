import {Component, EventEmitter, Output} from '@angular/core';
import {CreditCard, PaymentOption} from "../../../../models/payment-option.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";
import {environment} from "../../../../../environment/dev.environment";

@Component({
	selector: 'app-payment-form',
	templateUrl: 'payment-form.component.html',
	styles: [
	]
})
export class PaymentFormComponent {
	@Output() selectPaymentOption = new EventEmitter<PaymentOption>();

	paymentForm: FormGroup;
	paymentOptions: string[] = ['PayPal', 'Credit card', 'Bank transfer', 'Payment on delivery'];

	public payPalConfig!: IPayPalConfig;

	constructor(private formBuilder: FormBuilder) {
		this.paymentForm = this.formBuilder.group({
			paymentOption: ['', Validators.required]
		});

		this.initConfig();
	}

	private initConfig(): void {
		this.payPalConfig = {
			currency: 'EUR',
			clientId: environment.paypalSandboxKey,
			createOrderOnClient: (data) => <ICreateOrderRequest>{
				intent: 'CAPTURE',
				purchase_units: [
					{
						amount: {
							currency_code: 'EUR',
							value: '9.99',
							breakdown: {
								item_total: {
									currency_code: 'EUR',
									value: '9.99'
								}
							}
						},
						items: [
							{
								name: 'Enterprise Subscription',
								quantity: '1',
								category: 'DIGITAL_GOODS',
								unit_amount: {
									currency_code: 'EUR',
									value: '9.99',
								},
							}
						]
					}
				]
			},
			advanced: {
				commit: 'true'
			},
			style: {
				label: 'paypal',
				layout: 'vertical'
			},
			onApprove: (data, actions) => {
				console.log('Transaction was approved, but not completed.', data, actions);
				actions.order.get().then((details: any) => {
					console.log('PayPal order details:', details);
				});
			},
			onClientAuthorization: (data) => {
				console.log('PayPal order successful, data:', data);
			},
			onCancel: (data, actions) => {
				console.log('PayPal order cancelled, data:', data);
			},
			onError: err => {
				console.log('Error occurred during PayPal transaction:', err);
			},
			onClick: () => {
				console.log('PayPal button clicked');
			},
		};
	}

	onSelectPaymentOption() {
		this.selectPaymentOption.emit({
			type: this.paymentForm.get('paymentOption')!.value
		});
	}

	onCreditCardFormSubmit(creditCardDetails: CreditCard) {
		this.selectPaymentOption.emit({
			type: 'Credit card',
			cardDetails: creditCardDetails
		});
	}
}
