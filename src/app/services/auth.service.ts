import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  constructor(
    private fire: AngularFireAuth,
    ) { 
    }

  signUp(email: string, password: string){
    return this.fire.createUserWithEmailAndPassword(email, password);
  }

  signIn(email: string, password: string){
    return this.fire.signInWithEmailAndPassword(email, password);
  }

  getUser(){
    return this.fire.authState;
  }


  logOut(){
    return this.fire.signOut();
  }
}
