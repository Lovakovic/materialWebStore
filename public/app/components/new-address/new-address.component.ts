import {Component, EventEmitter, Output} from '@angular/core';
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
    @Output() addAddress = new EventEmitter();

  newAddressForm = new FormGroup({
    addressNickname: new FormControl('', [
        Validators.maxLength(63)
    ]),
    address: new FormGroup({
      name: new FormControl('', [
          Validators.required,
          Validators.maxLength(63)
      ]),
      company: new FormControl('', Validators.maxLength(127)),
      street: new FormControl('', [
          Validators.required,
          Validators.maxLength(99)
      ]),
      city: new FormControl('', [
          Validators.required,
          Validators.maxLength(44)
      ]),
      zipCode: new FormControl('', Validators.maxLength(15)),
      country: new FormControl('', [
          Validators.required,
          Validators.maxLength(74)
      ]),
    }),
    phone: new FormControl('', [
        Validators.required,
        Validators.maxLength(19)
    ]),
    deliveryInstructions: new FormControl('', Validators.maxLength(500)),
    primary: new FormControl(false)
  });

  get addressNickname() {
      return this.newAddressForm.get('addressNickname');
  }

  get name() {
      return this.newAddressForm.get('address.name');
  }

  get company() {
      return this.newAddressForm.get('address.company');
  }

  get street() {
      return this.newAddressForm.get('address.street');
  }

  get city() {
      return this.newAddressForm.get('address.city');
  }

  get zipCode() {
      return this.newAddressForm.get('address.zipCode');
  }

  get country() {
      return this.newAddressForm.get('address.country');
  }

  get phone() {
      return this.newAddressForm.get('phone');
  }

  get deliveryInstructions() {
      return this.newAddressForm.get('deliveryInstructions');
  }

  getErrorMessage(controlName: string): string | void {
      const control = this.newAddressForm.get(controlName);

      if(control?.errors?.['required']) {
          return `This field is required`;
      }
      if(control?.errors?.['maxlength']) {
          return `Maximum length is ${control?.errors?.['maxlength'].requiredLength} characters.`
      }
  }

  onSubmit(): void {
      // Flatten the object
      const {
          addressNickname,
          deliveryInstructions,
          phone,
          address: { city, company, country, name, street, zipCode } = {},
          primary
      } = this.newAddressForm.value;

      // Remove fields that the user didn't enter, standardize values returned
      // from newAddressForm, so it fits the Address model
      const flatAddress = {
          name: name || '',
          addressNickname: addressNickname || undefined,
          company: company || undefined,
          street: street || '',
          city: city || '',
          zipCode: zipCode || undefined,
          country: country || '',
          phone: phone || '',
          deliveryInstructions: deliveryInstructions || undefined,
	      isPrimary: primary || undefined
      }

      this.addAddress.emit(flatAddress);
  }
}
