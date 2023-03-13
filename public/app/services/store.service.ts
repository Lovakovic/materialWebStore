import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../models/product.model";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private _http: HttpClient) { }

  getAllProducts(limit = '12', sort = 'desc', category?: string): Observable<Array<Product>> {
    return this._http.get<Array<Product>>(
        `${environment.baseUrl}/products${
          category ? '/category/' + category : ''
        }?sort=${sort}&limit=${limit}`,
    );
  }

  getAllCategories(): Observable<Array<string>> {
    return this._http.get<Array<string>>(
        `${environment.baseUrl}/products/categories`
    );
  }
}
