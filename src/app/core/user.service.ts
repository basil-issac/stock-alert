import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { FirestoreService } from "../firestore.service";
import { environment } from "src/environments/environment";
import { HistoryService } from "../history/history.service";

@Injectable()
export class UserService {

  constructor(
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private fireStore: FirestoreService,
    private historyService: HistoryService
  ) {
  }


  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser(value) {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

  updateUserLoginTimeToNow() {
    var d = new Date();
    var date = d.getUTCMonth() + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
    var time = ' ' + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    var lastLoginDateTime = `${date} ${time}`;
    var user = firebase.auth().currentUser;
    this.db.doc(`users/${user.email}`).update(
      {
        'lastLogin': lastLoginDateTime
      }
    );
    this.historyService.saveHistory(user.email, "Logged in.");
  }

  createUserInDatabase(email: string,
    first: string,
    last: string,
  ) {

    var isAdmin = false;

    if (email == 'bissac@mail.depaul.edu' || email == 'cgreg@depaul.edu') {
      isAdmin = true;
    }

    var d = new Date();
    var date = d.getUTCMonth() + '/' + d.getUTCDate() + '/' + d.getUTCFullYear();
    var time = ' ' + d.getUTCHours() + ":" + d.getUTCMinutes() + ":" + d.getUTCSeconds();
    var createdDateTime = `${date} ${time}`;

    this.db.doc(`users/${email}`).update(
      {
        'first': first,
        'last': last,
        'admin': isAdmin,
        'created': createdDateTime,
        'login': createdDateTime,
        'active': true
      }
    );
    this.historyService.saveHistory(email, "Account created.");
  }

  updateCurrentUserName(first: string, last: string) {
    var user = firebase.auth().currentUser;
    this.db.doc(`users/${user.email}`).update(
      {
        'first': first,
        'last': last
      }
    );
  }

  getUserDetails(email: string) {

    return this.db.doc(`users/${email}`).valueChanges();

  }

}