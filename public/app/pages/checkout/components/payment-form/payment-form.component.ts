import {Component, EventEmitter, Output} from '@angular/core';
import {PaymentOption} from "../../../../models/payment-option.model";
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
	paymentOptions: string[] = ['Bank transfer', 'Payment on delivery'];

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
}
