import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {StoreService} from "../../services/store.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-filters',
  templateUrl: 'filters.component.html'
})
export class FiltersComponent implements OnInit, OnDestroy {

  @Output() showCategory = new EventEmitter<string>();
  categorySubscription: Subscription | undefined;
  categories: Array<string> | undefined;

  constructor(private storeService: StoreService) {
  }

  ngOnInit(): void {
    this.categorySubscription = this.storeService.getAllCategories()
        .subscribe(res => {
          this.categories = res;
        });
  }

  onShowCategory(category: string): void {
    this.showCategory.emit(category);
  }

  ngOnDestroy(): void {
    // Gotta prevent the memory leaks!
    if(this.categorySubscription) {
      this.categorySubscription.unsubscribe();
    }
  }
}
