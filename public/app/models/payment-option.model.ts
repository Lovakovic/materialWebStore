export interface PaymentOption {
	type: 'PayPal' | 'Credit card' | 'Bank transfer' | 'Payment on delivery';
	cardDetails?: CreditCard;
}

export interface CreditCard {
	name: string;
	cardNumber: string;
	expirationDate: string;
	cvv: string;
}
