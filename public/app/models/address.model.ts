export interface Address {
    id?: number;
    name: string;
    addressNickname?: string;
    companyName?: string;
    street: string;
    city: string;
    zipCode?: string;
    country: string;
    phone: string;
    deliveryInstructions?: string;
    main?: boolean;
    lastModified?: string;
}
