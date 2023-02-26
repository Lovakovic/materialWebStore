import {Component, Input} from '@angular/core';
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
  @Input() address: Address | undefined;

  onDelete() {
    console.log(`${this.address?.nickname ? this.address.nickname : this.address?.name} deleted.`)
  }
}
