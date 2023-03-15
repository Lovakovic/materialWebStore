import {Component} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Product} from "../../models/product.model";
import {BehaviorSubject, Observable, switchMap} from "rxjs";
import {StoreService} from "../../services/store.service";

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 250 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  queryParamsSubject = new BehaviorSubject<{ sort: string, count: string, category?: string}>(
      { sort: 'desc', count: '12'});

  queryParams$ = this.queryParamsSubject.asObservable();
  products$: Observable<Product[]> = this.queryParams$.pipe(
      switchMap(params => this.storeService.getProducts(params.count, params.sort, params.category))
  );

  // Display params
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;


  constructor(
      private cartService: CartService,
      private storeService: StoreService) {
  }

  onColumnsCountChange(colsNumber: number): void {
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.queryParamsSubject.next({ ...this.queryParamsSubject.value, category: newCategory });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      image: product.image,
      name: product.name,
      price: product.price,
      quantity: 1,
      productId: product.id
    }, true)
  }

  onItemsCountChange(newCount: number): void {
    this.queryParamsSubject.next({ ...this.queryParamsSubject.value, count: newCount.toString() });
  }

  onSortChange(newSort: string): void {
    this.queryParamsSubject.next({ ...this.queryParamsSubject.value, sort: newSort });
  }
}
