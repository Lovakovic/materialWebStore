import {Component} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-menu',
  templateUrl: 'user-menu.component.html',
  styleUrls: ['user-menu.component.css']
})
export class UserMenuComponent {
	constructor(
		private authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) { }

	onLogout(): void {
		this.authService.logout().subscribe(() => {
			this.snackBar.open(`You've been logged out.`, '', { duration: 3000 });
			this.router.navigate(['']);
		});
	}

	onAddressesClicked() {
		this.router.navigate(['my-addresses'])
	}

	onOrdersClicked() {
		this.router.navigate(['my-orders']);
	}
}
