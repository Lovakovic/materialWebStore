import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnDestroy {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  loginSubscription: Subscription | undefined;

  constructor(
      private auth: AuthService,
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

    // Redirect the user upon successful login
    this. loginSubscription = this.auth.login(credentials)
        .subscribe((res: HttpResponse<any>) => {
      if(res.body === 'Success') {
        this.snackBar.open('You are now logged in.', '', { duration: 2000 });
        this.router.navigate(['/']);
      }
    }, () => {
          this.loginForm.patchValue({ password: '' });
          this.snackBar.open('Invalid email / password combination.', '', { duration: 2000 })
        });
  }

  navigateToRegister() {
    this.router.navigate(['register']);
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
