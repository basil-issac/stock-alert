import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { UserService } from '../core/user.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[];

  constructor(private adminService: AdminService, private userService: UserService) {
    this.users = [];

   }

  ngOnInit() {
    var user = firebase.auth().currentUser;
    this.userService.getUserDetails(user.email).subscribe((response: any) => {
      if(response['admin']) {
        this.adminService.getAllUsers().subscribe((response: any[]) => {
          console.log(`ADMIN USERS: ${response}`);
          this.users = response;
        })
      }
    });
  }

}
