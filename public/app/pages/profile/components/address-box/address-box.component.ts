import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Address} from "../../../../models/address.model";

@Component({
  selector: 'app-address-box',
  templateUrl: './address-box.component.html',
  styles: [`
    mat-list-item {
      height: 1.7rem !important;
      padding-left: 0;
    }
  `]
})
export class AddressBoxComponent {
  @Input() address?: Address;
  // For some reason I was getting the error whe trying to do a comparison and pass a boolean
  // here instead of the whole id so that's why there's primaryAddressId in every address component
  @Input() primaryAddressId?: number;

  @Output() deleteAddress = new EventEmitter();

  onDeleteAddress(): void {
      this.deleteAddress.emit(this.address);
  }
}
