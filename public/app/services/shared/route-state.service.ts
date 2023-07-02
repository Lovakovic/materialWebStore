import { Injectable } from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RouteStateService {
	constructor(private router: Router) {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((event: any) => {
			localStorage.setItem('route', event.urlAfterRedirects);
		});
	}

	loadLastRoute() {
		const lastRoute = localStorage.getItem('route');
		if (lastRoute) {
			this.router.navigateByUrl(lastRoute);
		}
	}
}
