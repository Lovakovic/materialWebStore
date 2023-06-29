import {Component, EventEmitter, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import * as Card from 'card-validator';
import {CreditCard} from "../../models/payment-option.model";
import * as moment from 'moment';

@Component({
	selector: 'app-credit-card-form',
	templateUrl: 'credit-card-form.component.html',
	styleUrls: ['credit-card-form.component.css']
})
export class CreditCardFormComponent {
	@Output() onCreditCardFormSubmit = new EventEmitter<CreditCard>();

	creditCardForm: FormGroup;

	cardIcons = {
		visa: 'assets/card-providers/visa.svg',
		mastercard: 'assets/card-providers/mastercard.svg',
		amex: 'assets/card-providers/amex.svg',
		discover: 'assets/card-providers/discover.svg',
	};

	constructor(private formBuilder: FormBuilder) {
		this.creditCardForm = this.formBuilder.group({
			name: ['', Validators.required],
			cardNumber: ['', [Validators.required, this.cardNumberValidator]],
			expirationDate: ['', [Validators.required, this.futureDateValidator()]],
			cvv: ['', [Validators.required, Validators.maxLength(4)]]
		});
	}

	onFormSubmit() {
		if (this.creditCardForm.valid) {
			this.onCreditCardFormSubmit.emit(this.creditCardForm.value);
		}
	}

	cardNumberValidator(control: AbstractControl): { [key: string]: any } | null {
		const numberValidation = Card.number(control.value);
		return numberValidation.isValid ? null : { 'invalidCardNumber': { value: control.value } };
	}

	futureDateValidator(): ValidatorFn {
		return (control: AbstractControl): { [key: string]: any } | null => {
			const inputDate = moment(control.value, "MM/YYYY");
			if (!inputDate.isValid()) {
				return { 'invalidFormat': true };
			}

			const now = moment();
			const forbidden = now.isAfter(inputDate);
			return forbidden ? { 'forbiddenDate': { value: control.value } } : null;
		};
	}

	getCardType(): string | null {
		const cardNumber = this.creditCardForm.get('cardNumber')?.value;
		const cardValidation = Card.number(cardNumber);
		return cardValidation.card?.type || null;
	}
}
