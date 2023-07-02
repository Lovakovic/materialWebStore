import {Component, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../../../models/product.model";
import {ProductService} from "../../../../services/shared/product.service";
import {AddNewProductComponent} from "./components/add-new-product/add-new-product.component";

@Component({
	selector: 'app-manage-products',
	templateUrl: 'manage-products.component.html',
	styles: []
})
export class ManageProductsComponent implements  OnInit {
	@ViewChild(AddNewProductComponent) addNewProductComponent!: AddNewProductComponent;

	products: Product[] = [];

	constructor(private productService: ProductService) { }

	ngOnInit(): void {
		this.productService.getProducts().subscribe(products => this.products = products);
	}

	editProduct(product: Product): void {
		this.addNewProductComponent.fillProductDetails(product);
	}

	deleteProduct(product: Product): void {
		this.productService.deleteProduct(product).subscribe(() => {
			this.refreshProducts();
		});
	}

	refreshProducts(): void {
		this.productService.getProducts().subscribe(products => this.products = products);
	}
}
