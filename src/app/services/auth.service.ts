import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userid = null;

  constructor(
    private fire: AngularFireAuth,
    ) { 
    }


  passUser(user){
    this.userid = user.id;
  }

  getUserId(){
    return this.userid;
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
