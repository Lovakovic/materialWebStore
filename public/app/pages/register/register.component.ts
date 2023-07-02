import {Component} from '@angular/core';
import {AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {catchError, delay, map, Observable, of, switchMap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30)
    ]),
    password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(48),
    ]),
    passwordRepeat: new FormControl('', [
        Validators.required,
    ]),
    email: new FormControl('', {
        validators: [
            Validators.required,
            Validators.email
        ],
        asyncValidators: [this.uniqueEmailValidator()]
    })
  }, {
      validators: this.passwordsMatchValidator('password', 'passwordRepeat')
  });

  constructor(
      private authService: AuthService,
      private snackbar: MatSnackBar,
      private router: Router
  ) { }

    get email() {
        return this.registerForm.get('email');
    }

    get password() {
        return this.registerForm.get('password');
    }

    get passwordRepeat() {
        return this.registerForm.get('passwordRepeat');
    }

    get username() {
        return this.registerForm.get('username');
    }

  passwordsMatchValidator(passwordKey: string, passwordConfirmKey: string) {
      return (formGroup: AbstractControl): ValidationErrors | null => {
          const password = formGroup.get(passwordKey);
          const passwordConfirm = formGroup.get(passwordConfirmKey);

          if(!password || !passwordConfirm) {
              return null;
          }

          // Check if we have any other errors before
          if(passwordConfirm.errors &&
              !passwordConfirm.errors['passwordMismatch']) {
              return null;
          }

          if(password.value !== passwordConfirm.value) {
              passwordConfirm.setErrors({ passwordMismatch: true });
              return { passwordMismatch: true };
          } else {
              passwordConfirm.setErrors(null);
              return null;
          }
      }
  }

    // Validator with debounce timer of 500ms
    uniqueEmailValidator(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return of(control.value).pipe(
                delay(500),
                switchMap(email => this.authService.checkEmailAvailability(email).pipe(
                    map(exists => exists ? { taken: true } : null ),
                    catchError(() => of(null))
                ))
            );
        }
    }

  onSubmit() {
      // Simplify the object model and throw away unnecessary stuff
      delete this.registerForm.value.passwordRepeat;
      const credentials = {
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password
      }

      // Redirect the user to login page upon successful registration
      this.authService.register(credentials).subscribe(success => {
          if(success) {
              this.snackbar.open('Registration successful, please log in.', '', { duration: 3000 });
              this.router.navigate(['login']);
          } else {
              this.snackbar.open('Something went wrong, please try again later.', 'OK');
          }
      });
  }

	onNavigateToLogin() {
		this.router.navigate(['login']);
	}
}
