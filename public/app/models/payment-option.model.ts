export interface PaymentOption {
	type: 'credit-card' | 'bank-transfer' | 'payment-on-delivery';
	cardDetails?: CardDetails;
}

export interface CardDetails {
	name: string;
	cardNumber: string;
	expirationDate: string;
	cvv: string;
}
