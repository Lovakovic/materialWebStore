export interface Cart {
    items: Array<CartItem>;
}

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}
