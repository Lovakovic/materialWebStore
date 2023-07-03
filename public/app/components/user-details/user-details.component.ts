import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.model";
import {UserService} from "../../services/admin/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth/auth.service";
import {Location} from "@angular/common";

@Component({
  selector: 'app-user-details',
  templateUrl: 'user-details.component.html',
  styles: [
  ]
})
export class UserDetailsComponent implements OnInit {
	user?: User;
	isEditing = false;
	userForm: FormGroup;

	constructor(private userService: UserService,
				public authService: AuthService,
				private router: Router,
				private route: ActivatedRoute,
				private location: Location,
				private fb: FormBuilder) {

		const validators = this.authService.isAdmin() ? [] : [
			Validators.required,
			Validators.minLength(6),
			Validators.maxLength(30)
		];

		this.userForm = this.fb.group({
			username: ['', validators],
			email: ['', [Validators.required, Validators.email]],
			role: ['', Validators.required]
		});
	}


	ngOnInit() {
		// @ts-ignore
		const id = +this.route.snapshot.paramMap.get('id');
		if (id) {
			this.userService.getUser(id).subscribe(user => {
				this.user = user;
				this.populateForm();
			});
		} else {
			// If id is not provided, use the logged in user
			this.authService.user$.subscribe(user => {
				this.user = user;
				this.populateForm();
			});
		}
	}

	populateForm() {
		this.userForm.patchValue({
			username: this.user!.username,
			email: this.user!.email,
			role: this.user!.role
		});
		if (!this.authService.isAdmin()) {
			this.userForm.get('role')?.disable();
		}
	}


	get f() {
		return {
			username: this.userForm.get('username'),
			email: this.userForm.get('email'),
			role: this.userForm.get('role')
		};
	}

	updateUser() {
		if (this.userForm.valid) {
			this.userService.updateUser({...this.user, ...this.userForm.value}).subscribe(updatedUser => {
				this.user = updatedUser;
				this.populateForm();
				this.isEditing = false;
			});
		}
	}

	deleteUser() {
		if (this.user) {
			this.userService.deleteUser(this.user).subscribe(() => {
				this.location.back();
			});
		}
	}

	startEditing() {
		this.isEditing = true;
	}

	cancelEditing() {
		this.isEditing = false;
	}
}
