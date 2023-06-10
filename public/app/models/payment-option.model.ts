export interface PaymentOption {
	type: 'Credit card' | 'Bank transfer' | 'Payment on delivery';
	cardDetails?: CardDetails;
}

export interface CardDetails {
	name: string;
	cardNumber: string;
	expirationDate: string;
	cvv: string;
}
