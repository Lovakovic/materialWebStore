import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {AddressService} from "../../services/address.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
      private authService: AuthService,
      private userService: AddressService,
      private snackBar: MatSnackBar,
      private router: Router
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    const credentials = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe(success => {
        if(success) {
            this.snackBar.open('You are now logged in.', '', { duration: 3000 });
            this.router.navigate(['/']);
        } else {
            this.loginForm.patchValue({ password: '' });
            this.snackBar.open('Invalid email / password combination.', '', { duration: 3000 });
            this.loginForm.patchValue({ password: '' });
        }
    });
  }

  navigateToRegister() {
    this.router.navigate(['register']);
  }
}
