import { Component } from '@angular/core';
import { UserService } from './core/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Stock Watch';
  loggedIn = false;

  constructor(private userService: UserService,
    private router: Router) {
  }

}
