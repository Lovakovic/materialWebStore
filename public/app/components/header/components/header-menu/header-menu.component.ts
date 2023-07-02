import {Component} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header-menu',
  templateUrl: 'header-menu.component.html',
  styleUrls: ['header-menu.component.css']
})
export class HeaderMenuComponent {
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
		this.router.navigate(['my-user-addresses'])
	}

	onOrdersClicked() {
		this.router.navigate(['my-user-orders']);
	}
}
