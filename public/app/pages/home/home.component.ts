import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartService} from "../../services/cart.service";
import {Product} from "../../models/product.model";
import {Subscription} from "rxjs";
import {StoreService} from "../../services/store.service";

const ROWS_HEIGHT: { [id: number]: number } = { 1: 400, 3: 335, 4: 250 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;

  // Arguments for storeService so we don't get unnecessary data
  sort = 'desc';
  count = '12';
  productSubscription: Subscription | undefined;


  constructor(private _cartService: CartService, private _storeService: StoreService) {
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.productSubscription =  this._storeService.getAllProducts(this.count, this.sort, this.category)
        .subscribe((_products) => {
          this.products = _products;
        })
  }

  onColumnsCountChange(colsNumber: number): void {
    this.cols = colsNumber;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }

  onShowCategory(newCategory: string): void {
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void {
    this._cartService.addToCart({
      image: product.image,
      name: product.name,
      price: product.price,
      quantity: 1,
      productId: product.id
    })
  }

  onItemsCountChange(newCount: number): void {
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort: string): void {
    this.sort = newSort;
    this.getProducts();
  }

  ngOnDestroy(): void {
    // Don't forget to prevent memory leaks!
    if(this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }
}
