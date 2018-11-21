import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { UserService } from '../core/user.service';
import * as firebase from 'firebase/app';
import { HistoryService } from '../history/history.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[];
  isAdmin: boolean;
  history: any[];
  viewingUser: string;

  constructor(private adminService: AdminService,
     private userService: UserService,
     private historyService: HistoryService) {
    this.users = [];

   }

  ngOnInit() {
    var user = firebase.auth().currentUser;
    this.userService.getUserDetails(user.email).subscribe((response: any) => {
      if(response['admin']) {
        this.isAdmin = true;
        this.adminService.getAllUsers().subscribe((response: any[]) => {
          this.users = response;
        })
      } else {
        this.isAdmin = false;
      }
    });
  }

  viewHistory(email: string) {
    this.historyService.getHistory(email).subscribe((response:any[]) => {
      this.viewingUser = email;
      this.history = response;
    });
  }

}
