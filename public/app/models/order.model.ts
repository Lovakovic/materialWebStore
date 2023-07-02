import {CartItem} from "./cart.model";
import {Address} from "./address.model";

export interface Order {
	id?: number;
	items: CartItem[];
	shippingAddress: Address;
	paymentMethod: 'on-delivery' | 'bank-transfer' | 'paypal';
	total: string;
}

export interface PayPalTransaction {
	orderId?: number;
	transactionId: string;
	status?: string;
}
