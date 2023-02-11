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

  //
  productSubscription: Subscription | undefined;


  constructor(private cartService: CartService, private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy(): void {
    // Don't forget to prevent memory leaks!
    if(this.productSubscription) {
      this.productSubscription.unsubscribe();
    }
  }

  getProducts(): void {
    this.productSubscription=  this.storeService.getAllProducts(this.count, this.sort)
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
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    })
  }
}
