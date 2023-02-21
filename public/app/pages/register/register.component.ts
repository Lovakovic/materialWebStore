import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit{
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
    email: new FormControl('', [
        Validators.required,
        Validators.email
    ])
  }, {
      validators: this.passwordsMatchValidator('password', 'passwordRepeat')
  });


  constructor(private auth: AuthService) {
  }

  ngOnInit(): void {
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

  emailUniqueValidator(control: AbstractControl) {
      // Implement async validator to check witch backend if email is free
  }

  get username() {
      return this.registerForm.get('username');
  }

  get email() {
      return this.registerForm.get('email');
  }

  get password() {
      return this.registerForm.get('password');
  }

  get passwordRepeat() {
      return this.registerForm.get('passwordRepeat');
  }

  onSubmit() {
      // Simplify the object model and throw away unnecessary stuff
      delete this.registerForm.value.passwordRepeat;
      const credentials = {
          username: this.registerForm.value.username,
          email: this.registerForm.value.email,
          password: this.registerForm.value.password
      }

      this.auth.register(credentials);
  }
}
