import {CartItem} from "./cart.model";
import {Address} from "./address.model";

export interface Order {
	id?: number;
	items: CartItem[];
	shippingAddress: Address;
}
