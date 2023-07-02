import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
	user: User | undefined;
	constructor(public authService: AuthService,
				private router: Router) {
		authService.user$.subscribe(user => {
			this.user = user;
		});
	}

	onNavigateToLogin() {
		this.router.navigate(['login']);
	}

	onNavigateToHome() {
		if (this.user) {
			if (this.authService.isAdmin()) {
				this.router.navigate(['admin']);
			} else {
				this.router.navigate(['user']);
			}
		} else {
			this.router.navigate(['user']);
		}
	}

	isAdmin() {
		return this.authService.isAdmin();
	}
}
