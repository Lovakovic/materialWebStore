import {Component, EventEmitter, Output} from '@angular/core';
import {CreditCard, PaymentOption} from "../../../../models/payment-option.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
	selector: 'app-payment-form',
	templateUrl: 'payment-form.component.html',
	styles: [
	]
})
export class PaymentFormComponent {
	@Output() selectPaymentOption = new EventEmitter<PaymentOption>();

	paymentForm: FormGroup;
	paymentOptions: string[] = ['Credit card', 'Bank transfer', 'Payment on delivery'];

	constructor(private formBuilder: FormBuilder) {
		this.paymentForm = this.formBuilder.group({
			paymentOption: ['', Validators.required]
		});
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
