import {Component, Input} from '@angular/core';
import {Address} from "../../../../models/address.model";
import {UserService} from "../../../../services/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";

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

  constructor(
      private _userService: UserService,
      private _snackBar: MatSnackBar
  ) {}

  onDelete() {
    this._userService.deleteAddress(this.address?.id || -1)
        .subscribe(res => {
          if(res === 'Success') {
            this._snackBar.open('Address deleted.', '', { duration: 1500 });
          }
        });
  }
}
