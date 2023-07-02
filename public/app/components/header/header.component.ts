import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(public authService: AuthService,
			  private router: Router) { }

  onNavigateToLogin() {
    this.router.navigate(['login']);
  }

  onNavigateToHome() {
	  this.router.navigate(['home']);
  }
}
