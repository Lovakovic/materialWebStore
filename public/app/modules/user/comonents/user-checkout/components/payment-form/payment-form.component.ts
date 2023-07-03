import {Component, EventEmitter, Output} from '@angular/core';
import {PaymentOption} from "../../../../../../models/payment-option.model";
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

	bankAccountInfo = {
		accountNumber: 'HR1234567890123456789',
		bankName: 'Hippo Alpe Adria Bank',
		recipientName: 'Ivo Sanader'
	};

	constructor(private formBuilder: FormBuilder) {
		this.paymentForm = this.formBuilder.group({
			paymentOption: ['', Validators.required]
		});
	}

	onSelectPaymentOption() {
		const selectedOption = this.paymentForm.get('paymentOption')!.value;
		if (selectedOption === 'Bank transfer') {
			this.selectPaymentOption.emit({ type: 'bank-transfer' });
		} else if (selectedOption === 'Payment on delivery') {
			this.selectPaymentOption.emit({ type: 'on-delivery' });
		}
	}
}
