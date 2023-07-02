import {Component, EventEmitter, Output} from '@angular/core';
import {ProductService} from "../../../../../../services/shared/product.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})
export class FiltersComponent {
  categories$: Observable<string[]> = this.storeService.getCategories();

  @Output() showCategory = new EventEmitter<string>();

  constructor(private storeService: ProductService) { }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }
}
