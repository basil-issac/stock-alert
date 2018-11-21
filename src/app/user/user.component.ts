import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import * as firebase from 'firebase/app';
import { HistoryService } from '../history/history.service';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit {

  user: any;
  profileForm: FormGroup;
  userDetails: any;
  alertMessage: string;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    private historyService: HistoryService
  ) {

  }

  ngOnInit(): void {
    this.user = firebase.auth().currentUser;
    this.userService.getUserDetails(this.user.email).subscribe((response: any) => {
      this.userDetails = response;
    });
  }

  save(first: string, last: string) {
    this.userService.updateCurrentUserName(first, last);
    this.alertMessage = "Successfully updated name.";
    this.historyService.saveHistory(this.user.email, `Updated name to ${first} ${last}`);
  }

  logout() {
    this.authService.doLogout()
      .then((res) => {
        this.historyService.saveHistory(this.user.email, "Logged out.");
        this.location.back();
      }, (error) => {
        console.log("Logout error", error);
      });
  }
}