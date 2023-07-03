export interface User {
	id: number;
	username: string;
	email: string;
	primaryAddressId?: number;
	registeredAt: Date;
	role: 'usr' | 'adm';
}
