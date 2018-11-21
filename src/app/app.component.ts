import { Component } from '@angular/core';
import { UserService } from './core/user.service';
import { Router, NavigationEnd } from '@angular/router';
import * as firebase from 'firebase/app';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  env = environment;
  isAdmin: boolean;

  constructor(private userService: UserService,
    private router: Router) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('send', 'pageview');
        }
      });

  }

  ngOnInit() {

    var user = firebase.auth().currentUser;
    if (user != null) {
      environment.isLoggedIn = true;
    }

    firebase.auth().onAuthStateChanged(function (user) {
      if (user != null) {
        environment.isLoggedIn = true;
        console.log(`App component -- ${user.email}`);
      } else {
        environment.isLoggedIn = false;
      }
    });

  }


}
