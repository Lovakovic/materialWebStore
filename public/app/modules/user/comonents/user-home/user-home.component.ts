import {Component, OnDestroy} from '@angular/core';
import {CartService} from "../../../../services/user/cart.service";
import {Product} from "../../../../models/product.model";
import {BehaviorSubject, Observable, Subscription, switchMap} from "rxjs";
import {ProductService} from "../../../../services/shared/product.service";

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 250 };

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html'
})
export class UserHomeComponent implements OnDestroy {
  queryParamsSubject = new BehaviorSubject<{ sort: string, count: string, category?: string}>(
      { sort: 'desc', count: '12'});

  queryParams$ = this.queryParamsSubject.asObservable();
  products$: Observable<Product[]> = this.queryParams$.pipe(
      switchMap(params => this.storeService.getProducts(params.count, params.sort, params.category))
  );

  private subscription = new Subscription();

  // Display params
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;


  constructor(
      private cartService: CartService,
      private storeService: ProductService
  ) {}

  onColumnsCountChange(colsNumber: number): void {
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.queryParamsSubject.next({ ...this.queryParamsSubject.value, category: newCategory });
  }

  onAddToCart({id, image, name, price}: Product): void {
    this.subscription.add(
        this.cartService.addToCart({productId: id!, image, name, price, quantity: 1}, true).subscribe());
  }

  onItemsCountChange(newCount: number): void {
    this.queryParamsSubject.next({ ...this.queryParamsSubject.value, count: newCount.toString() });
  }

  onSortChange(newSort: string): void {
    this.queryParamsSubject.next({ ...this.queryParamsSubject.value, sort: newSort });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
