import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Address} from "../../../../models/address.model";

@Component({
  selector: 'app-user-address-box',
  templateUrl: './user-address-box.component.html',
  styles: [`
    mat-list-item {
      height: 1.7rem !important;
      padding-left: 0;
    }
  `]
})
export class UserAddressBoxComponent {
    @Input() address!: Address;
    @Input() expanded!: boolean;
    @Input() action!: string;

    @Output() chooseAddress = new EventEmitter();

    onAddressChosen(): void {
		this.chooseAddress.emit(this.address);
    }
}
