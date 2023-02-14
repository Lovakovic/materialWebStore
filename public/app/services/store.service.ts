import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";

const API_URL = 'http://localhost:8081';
// const API_URL = 'https://fakestoreapi.com';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private httpClient: HttpClient) { }

  getAllProducts(limit = '12', sort = 'desc', category?: string): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(
        `${API_URL}/products${
          category ? '/category/' + category : ''
        }?sort=${sort}&limit=${limit}`,
    );
  }

  getAllCategories(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(
        `${API_URL}/products/categories`
    );
  }
}
