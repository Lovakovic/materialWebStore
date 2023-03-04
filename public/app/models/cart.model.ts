export interface Cart {
    items: Array<Product>;
}

export interface Product {
    product: string;
    name: string;
    price: number;
    quantity: number;
    id: number;
}
