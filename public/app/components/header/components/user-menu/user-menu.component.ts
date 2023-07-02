import {Component, Input, ViewChild} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../../services/auth.service";
import {Router} from "@angular/router";
import {MatMenuTrigger} from "@angular/material/menu";

@Component({
  selector: 'app-user-menu',
  templateUrl: 'user-menu.component.html',
  styleUrls: ['user-menu.component.css']
})
export class UserMenuComponent {
	@Input() username: string = '';

	@ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
	menuTimeout!: any;

	constructor(
		private authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) { }

	onNavigateToProfile() {
		this.router.navigate(['profile']);
	}

	onLogout(): void {
		this.authService.logout().subscribe(() => {
			this.snackBar.open(`You've been logged out.`, '', { duration: 3000 });
			this.router.navigate(['']);
		});
	}

	openMenu() {
		this.trigger.openMenu();
	}

	closeMenuAfterSomeTime() {
		this.menuTimeout = setTimeout(() => {
			this.trigger.closeMenu();
		}, 1000);
	}

	keepOpen() {
		clearTimeout(this.menuTimeout);
	}
}
