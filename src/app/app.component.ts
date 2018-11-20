import { Component } from '@angular/core';
import { UserService } from './core/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  env = environment;

  constructor(private userService: UserService,
    private router: Router) {
  }


}
