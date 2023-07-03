import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../models/user.model";
import {environment} from "../../../environment/dev.environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

	getUsers() {
		return this.http.get<User[]>(`${environment.baseUrl}/user/users`, { withCredentials: true });
	}

	getUser(id: number) {
		return this.http.get<User>(`${environment.baseUrl}/user/users/${id}`, { withCredentials: true });
	}

	updateUser(user: User) {
	  return this.http.put<User>(`${environment.baseUrl}/user/users/${user.id}`, user, { withCredentials: true });
	}

	deleteUser(user: User) {
		return this.http.delete(`${environment.baseUrl}/user/users/${user.id}`, { withCredentials: true });
	}
}
