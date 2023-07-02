export interface Order {
	id?: number;
	items?: OrderItem[];
	shippingStreet: string;
	shippingCity: string;
	shippingCountry: string;
	billingStreet?: string;
	billingCity?: string;
	billingCountry?: string;
	paymentMethod: 'on-delivery' | 'bank-transfer' | 'paypal';
	status: string;
	total: number;
	paypalTransactionId?: string;
	paypalStatus?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface OrderItem {
	productId: number;
	name?: string;
	price: number;
	quantity: number;
}

export interface PayPalTransaction {
	id?: string;
	status?: string;
}
