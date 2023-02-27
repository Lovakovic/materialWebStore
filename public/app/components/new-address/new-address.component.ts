import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
      name: new FormControl('', [
          Validators.required
      ]),
      company: new FormControl(''),
      street: new FormControl('', [
          Validators.required
      ]),
      city: new FormControl('', [
          Validators.required
      ]),
      zipCode: new FormControl(''),
      country: new FormControl('', [
          Validators.required
      ]),
    }),
    phone: new FormControl('', [
        Validators.required
    ]),
    deliveryInstructions: new FormControl('')
  });

  onSubmit() {
    console.log(this.newAddressForm.value);
  }
}
