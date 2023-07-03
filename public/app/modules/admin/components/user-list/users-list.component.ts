import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../../services/admin/user.service";
import {User} from "../../../../models/user.model";

@Component({
  selector: 'app-user-list-list',
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.css']
})
export class UsersListComponent implements OnInit {
	displayedColumns: string[] = ['id', 'username', 'email', 'registeredAt', 'role', 'actions'];
	dataSource: User[] = [];

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.userService.getUsers().subscribe(users => {
			this.dataSource = users;
		});
	}
}
