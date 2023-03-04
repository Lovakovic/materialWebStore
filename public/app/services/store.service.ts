import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";

const API_URL = 'http://localhost:8081';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private _http: HttpClient) { }

  getAllProducts(limit = '12', sort = 'desc', category?: string): Observable<Array<Product>> {
    return this._http.get<Array<Product>>(
        `${API_URL}/products${
          category ? '/category/' + category : ''
        }?sort=${sort}&limit=${limit}`,
    );
  }

  getAllCategories(): Observable<Array<string>> {
    return this._http.get<Array<string>>(
        `${API_URL}/products/categories`
    );
  }
}
