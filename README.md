# MyStore

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.1.4.

# About this project 

This is a full stack webs store app made using MySQL, Express, Angular and Node.js. The starting point was
[this tutorial](https://youtu.be/Kbauf9IgsC4), however I've since expanded on it a lot and added a few features,
as well as implemented the backend. 

This is my first Angular project of this scale, so don't expect much in terms of quality of code or adhering to
more advanced principles. Despite that I will update this project as I learn, and who knows, maybe I'll deploy it
one day too. :)

If you have any questions or advice don't hesitate to contact me or make a pull request. You can see my plans for
this project in `notes.txt`, where lines marked with `+` are implemented features or completed tasks. 

## Running the app in development mode

### Frontend 
Run `ng serve` for a frontend dev server. Navigate to `http://localhost:4200/`. The application will automatically 
reload if you change any of the source files.

### Backend server
Run `node server.js` from project root dir for a backend Express server. The server will likely listen on port `8081` if available, otherwise 
check console of the server to see which port it's running on.

## Setting up the project locally

For now, the setting up the project isn't as user-friendly as I'd like it to be, and I definitely improve this in the
future, when I create a more final database design. But before I implement the functionality this is the only way
to set the project up.

1. Execute `npm install` to install packages for frontend and backend 
   * Packages for frontend and backend are both bundled in the same `package.json` file[^1]
2. Edit the credentials in `backend/config.js` so you can connect to your local database 
3. Set up your MySQL database by executing SQL scripts in project root: `DDL.sql` for DB structure and `DML.sql` for mock data
   * Mock users are: `admin@mail.com` + `adminpass` and `user@mail.com` + `userpass`
4. Run `node server.js` in project root to start up the backend server
5. Run `npm run start` in project root for running frontend client

[^1]: I know, I know, that's pretty dumb, and that is in fact me being lazy. In my defense, there aren't many packages
required for backend server, so it's not THAT cluttered.
