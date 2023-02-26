import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.component.html'
})
export class NewAddressComponent {
  newAddressForm = new FormGroup({
    name: new FormControl('', [

    ]),
    addressNickname: new FormControl('', [

    ]),
    phone: new FormControl('', [

    ]),
    deliveryInstructions: new FormControl(''),
    address: new FormGroup({
      company: new FormControl(''),
      street: new FormControl(''),
      city: new FormControl(''),
      zipCode: new FormControl(''),
      country: new FormControl(''),
    })
  });
}
