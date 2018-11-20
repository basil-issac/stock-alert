import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private db: AngularFirestore) { }

  saveHistory(user: string, historyMessage: string) {
    //this.fireStore.createDocument(`/users/${user}/history`,{message: message});
    //this.fireStore.updateDocument(`users/${user}/history`,{message: historyMessage});
    var d = new Date();
    var date = d.getUTCMonth() + '.' + d.getUTCDate() + '.' + d.getUTCFullYear();
    var time = ' ' + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    var searchDate = `${date} ${time}`;
    this.db.doc(`users/${user}`)
      .collection('history').add({'message': historyMessage, 'dateTime': searchDate});
  }

  getUserHistory(user: string) {
    return this.db.collection(`/users/${user}/history`).valueChanges();
  }
  
}
