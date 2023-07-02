import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
	styleUrls: ['product-box.component.css']
})
export class ProductBoxComponent {
	@Input() fullWidthMode = false;
	@Input() product!: Product;
	@Input() editable = false;

	@Output() addToCart = new EventEmitter<Product>();
	@Output() editProduct = new EventEmitter<Product>();
	@Output() deleteProduct = new EventEmitter<Product>();

	onAddToCart(): void {
		this.addToCart.emit(this.product);
	}

	onEditProduct(): void {
		this.editProduct.emit(this.product);
	}

	onDeleteProduct(): void {
		this.deleteProduct.emit(this.product);
	}
}
