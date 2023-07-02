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
    @Input() address!: Address;
    @Input() expanded!: boolean;
    @Input() action!: string;

    @Output() chooseAddress = new EventEmitter();

    onAddressChosen(): void {
		this.chooseAddress.emit(this.address);
    }
}
