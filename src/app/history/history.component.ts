import { Component, OnInit } from '@angular/core';
import { HistoryService } from './history.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  private history: any[];

  constructor(private historyService: HistoryService) { 
    this.history = [];
  }

  ngOnInit() {
    var user = firebase.auth().currentUser;
    this.historyService.getUserHistory(user.email).subscribe((response: any[]) => {
      this.history = response;
    })
  }

}
