import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})
export class NewAddressComponent {
  newAddressForm = new FormGroup({
    addressNickname: new FormControl(''),
    address: new FormGroup({
      name: new FormControl(''),
      company: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      country: new FormControl(''),
    }),
    phone: new FormControl(''),
    deliveryInstructions: new FormControl('')
  });
}
