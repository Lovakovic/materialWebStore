import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Credentials} from "../../models/credentials.model";
import {BehaviorSubject, catchError, map, Observable, of, switchMap, tap} from "rxjs";
import {User} from "../../models/user.model";
import {CartService} from "../user/cart.service";
import {environment} from "../../../environment/dev.environment";
type ResponseObserveType = 'response';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
	private initCompleteSubject = new BehaviorSubject<boolean>(false);
	initComplete$: Observable<boolean> = this.initCompleteSubject.asObservable();

	private userSubject = new BehaviorSubject<User | undefined>(undefined);
	user$: Observable<User | undefined> = this.userSubject.asObservable();


	constructor(
	  private http: HttpClient,
	  private cartService: CartService
	) {
	this.checkForLocalStorageAuth();
	}

	isAdmin(): boolean {
		const user = this.userSubject.value;
		return user ? user.role === 'adm' : false;
	}

	register(credentials: Credentials): Observable<boolean> {
	return this.http.post<HttpResponse<string>>(`${environment.baseUrl}/auth/register`, credentials,
		{observe: 'response'})
		.pipe(map(res => res.status === 200));
	}

	login(credentials: Credentials): Observable<boolean> {
	let loginHttpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
		withCredentials: true,
		observe: 'response' as ResponseObserveType
	};
	  let tokenExpires: Date;

	  return this.http
		  .post<HttpResponse<number>>(`${environment.baseUrl}/auth/login`, credentials, loginHttpOptions)
		  .pipe(
			  switchMap((res: HttpResponse<any>) => {
				  tokenExpires = new Date(res.body);
				  return this.getProfile().pipe(
					  tap((user: User) => {
						  console.log(`Your login expires at ${tokenExpires.toString()}`);
						  this.saveAuthToLocalStorage(user, tokenExpires);
					  }),
					  map(() => true)
				  );
			  }),
			  catchError(() => {
				  return of(false)
			  })
		  );
	}

	logout() {
	localStorage.clear();
		this.cartService.updateLocalCart({ items: [] });
		this.updateLocalUser(undefined);
		return this.http.get(`${environment.baseUrl}/auth/logout`, { withCredentials: true });
	}

	checkEmailAvailability(email: string) {
		return this.http.post<HttpResponse<{ taken: boolean }>>(`${environment.baseUrl}/auth/email`, { email });
	}

	getProfile() {
		return this.http.get<User>(`${environment.baseUrl}/auth/me`, { withCredentials: true });
	}

	updateLocalUser(user: User | undefined) {
		this.userSubject.next(user);
	}

	saveAuthToLocalStorage(user: User, expires: Date) {
		this.updateLocalUser(user);
		localStorage.setItem('jwtExpiry', expires.toISOString());

		setTimeout(() => {
			this.validateJwtExpiry(expires.toISOString());
		}, expires.getTime() - new Date().getTime());
	}


	checkForLocalStorageAuth() {
		const jwtExpiry = localStorage.getItem('jwtExpiry');
		if (jwtExpiry && this.validateJwtExpiry(jwtExpiry)) {
			this.getProfile().pipe(
				tap(user => {
					this.updateLocalUser(user);
					this.initCompleteSubject.next(true);
				}),
				catchError(error => {
					this.initCompleteSubject.next(true);
					return of(error);
				})
			).subscribe();
		} else {
			this.initCompleteSubject.next(true);
		}
	}

	validateJwtExpiry(jwtExpiry: string): boolean {
	// If JWT is invalid we remove user and its expiry date
	if(new Date() > new Date(jwtExpiry)) {
	  localStorage.removeItem('jwtExpiry');

	  return false;
	}

	return true;
	}
}
