import {Component, Input} from '@angular/core';
import {User} from "../../../../models/user.model";

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html'
})
export class ProfileHeaderComponent {
  @Input() user: User | undefined = {
    id: -1,
    email: 'admin@mail.com',
    username: 'admin'
  };

  constructor() {
  }


}
