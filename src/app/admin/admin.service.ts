import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirestoreService } from '../firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private fire: FirestoreService) {

   }

   getAllUsers() {
     return this.fire.getCollection('users');
   }

}
