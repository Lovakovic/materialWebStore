import {Component, EventEmitter, Output} from '@angular/core';
import {StoreService} from "../../../../services/store.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})
export class FiltersComponent {
  categories$: Observable<string[]> = this.storeService.getCategories();

  @Output() showCategory = new EventEmitter<string>();

  constructor(private storeService: StoreService) { }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }
}
