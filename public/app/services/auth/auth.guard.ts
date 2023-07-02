import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {map, Observable, of, switchMap} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private auth: AuthService, private router: Router) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> {
		return this.auth.initComplete$.pipe(
			switchMap(initComplete => {
				if (!initComplete) {
					return of(false);
				}
				return this.auth.user$.pipe(
					map(user => {
						if (user) {
							return true;
						} else {
							this.router.navigate(['/login']);
							return false;
						}
					})
				);
			})
		);
	}
}
