import {Component, Input} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  @Input() user: User | undefined;

  constructor(
      private auth: AuthService,
      private snackBar: MatSnackBar,
      private router: Router
  ) {
  }
  logout() {
    this.auth.logout().subscribe(() => {
        this.snackBar.open(`You've been logged out.`, '', { duration: 1500 });
        this.router.navigate(['']);
    });
  }
}
