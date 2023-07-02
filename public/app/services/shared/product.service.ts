import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../../models/product.model";
import {environment} from "../../../environment/dev.environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

	getProducts(limit = '12', sort = 'desc', category?: string): Observable<Array<Product>> {
		return this.http.get<Array<Product>>(
			`${environment.baseUrl}/products${ category ? '/category/' + category : '' }?sort=${sort}&limit=${limit}`,
		);
	}
	addProduct(product: Product): Observable<Product> {
		return this.http.post<Product>(`${environment.baseUrl}/products/new`, product, { withCredentials: true });
	}

	updateProduct(product: Product): Observable<Product> {
		return this.http.put<Product>(`${environment.baseUrl}/products`, product, { withCredentials: true });
	}

	deleteProduct(product: Product): Observable<any> {
		return this.http.delete(`${environment.baseUrl}/products/${product.id}`, { withCredentials: true });
	}

	getCategories(): Observable<Array<string>> {
		return this.http.get<Array<string>>(
			`${environment.baseUrl}/products/categories`
		);
	}
}
