import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription, switchMap, tap} from "rxjs";
import {Router} from "@angular/router";
import {User} from "../../models/user.model";
import {HttpResponse} from "@angular/common/http";
import {UserService} from "../../services/user.service";

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
      private userService: UserService,
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
    let tokenExpires: Date;

    this.loginSubscription = this.auth.login(credentials)
        .pipe(
            tap((res: HttpResponse<any>) => {
              tokenExpires = new Date(res.body);
            }),
            switchMap(() => this.auth.getProfile()))
        .subscribe({
          next: (user: User) => {
            console.log(`Your login expires at ${tokenExpires.toString()}`);
            this.auth.saveAuthToLocal(user, tokenExpires);
            this.snackBar.open('You are now logged in.', '', { duration: 2000 });
            this.router.navigate(['/']);
          },
          error: () => {
            this.loginForm.patchValue({ password: '' });
            this.snackBar.open('Invalid email / password combination.', '', { duration: 2000 })
          }
      });
  }

  navigateToRegister() {
    this.router.navigate(['register']);
  }

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }
}
