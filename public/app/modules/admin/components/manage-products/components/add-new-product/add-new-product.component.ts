import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {ProductService} from "../../../../../../services/shared/product.service";
import {Product} from "../../../../../../models/product.model";

@Component({
	selector: 'app-add-new-product',
	templateUrl: 'add-new-product.component.html',
	styleUrls: ['add-new-product.component.css']
})
export class AddNewProductComponent implements OnInit{
	editMode: boolean = false;
	@Output() productChanged = new EventEmitter();


	productForm = this.fb.group({
		name: ['', Validators.required],
		price: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
		category: [''],
		newCategory: [''],
		description: [''],
		image: ['', Validators.required],
		id: ['']
	});

	categories: Array<string> = [];
	newCategoryVisible: boolean = false;

	constructor(private fb: FormBuilder, private productService: ProductService) { }

	ngOnInit(): void {
		this.productService.getCategories().subscribe((categories) => {
			this.categories = categories;
		});

		this.productForm.controls['category'].valueChanges.subscribe(value => {
			this.newCategoryVisible = value === 'new';
		});
	}

	fillProductDetails(product: Product): void {
		this.editMode = true;
		this.productForm.controls.name.setValue(product.name);
		this.productForm.controls.price.setValue(String(product.price));
		this.productForm.controls.category.setValue(product.category!);
		this.productForm.controls.description.setValue(product.description!);
		this.productForm.controls.image.setValue(product.image);
		this.productForm.controls.id.setValue(String(product.id));
	}


	onSubmit(): void {
		if (this.productForm.valid) {
			const product: Product = {
				id: Number(this.productForm.controls.id.value!),
				name: this.productForm.controls.name.value!,
				price: Number(this.productForm.controls.price.value!),
				category: this.productForm.controls.category.value!,
				description: this.productForm.controls.description.value ?? undefined,
				image: this.productForm.controls.image.value!,
				newCategory: this.productForm.controls.newCategory.value ?? undefined
			};
			if(this.editMode){
				this.updateProduct(product);
			} else {
				this.addProduct(product);
			}
		}
	}

	addProduct(product: Product): void {
		this.productService.addProduct(product).subscribe(() => {
			this.productChanged.emit();
			console.log('Added product:', product);
			this.resetForm();
			this.refreshCategories();
			this.editMode = false;
		});
	}

	updateProduct(product: Product): void {
		this.productService.updateProduct(product).subscribe(() => {
			this.productChanged.emit();
			console.log('Updated product:', product);
			this.resetForm();
			this.refreshCategories();
			this.editMode = false;
		});
	}

	refreshCategories(): void {
		this.productService.getCategories().subscribe(categories => this.categories = categories)
	}

	resetForm(): void {
		this.productForm.reset();
		Object.keys(this.productForm.controls).forEach(key => {
			const control = (this.productForm.controls as Record<string, AbstractControl>)[key];
			control.setErrors(null);
			control.markAsPristine();
			control.markAsUntouched();
		});
	}

	cancelEdit(): void {
		this.productForm.reset();
		this.editMode = false;
	}
}
