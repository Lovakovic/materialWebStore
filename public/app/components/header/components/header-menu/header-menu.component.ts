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
		public authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) { }

	onLogout(): void {
		this.authService.logout().subscribe(() => {
			this.snackBar.open(`You've been logged out.`, '', { duration: 3000 });
			this.router.navigate(['']);
		});
	}

	onOrdersClicked() {
		if (this.authService.isAdmin()) {
			this.router.navigate(['admin/orders']);
		} else {
			this.router.navigate(['user/orders']);
		}
	}

	onAccountClicked() {
		this.router.navigate(['user/account']);
	}

	onAddressesClicked() {
		this.router.navigate(['user/addresses'])
	}

	onProductsClicked() {
		this.router.navigate(['admin/products']);
	}

	onUsersClicked() {
		this.router.navigate(['admin/user-list']);
	}
}
