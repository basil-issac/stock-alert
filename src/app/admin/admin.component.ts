import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[];

  constructor(private adminService: AdminService) {
    this.users = [];

   }

  ngOnInit() {
    this.adminService.getAllUsers().subscribe((response: any[]) => {
      console.log(`ADMIN USERS: ${response}`);
      this.users = response;
    })
  }

}
