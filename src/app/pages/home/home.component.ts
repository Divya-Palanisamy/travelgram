import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  users = [];
  posts = [];
  isLoading: boolean = false;

  constructor(
    private toastr: ToastrService,
    private db: AngularFireDatabase,
    private auth: AuthService,
  ) {

    this.isLoading = true;

    db.object('/users')
    .valueChanges()
    .subscribe(
      (object) => {
        if(object){
          this.users = Object.values(object);
          this.isLoading = false;
        }
        else{
          toastr.error("No User Found");
          this.users = [];
          this.isLoading = false;
        }
      }
    );

    //getting all posts from firebase
    db.object('/posts')
    .valueChanges()
    .subscribe((obj) => {
      if(obj){
        this.posts = Object.values(obj).sort();
        this.isLoading = false;
      }
      else{
        toastr.error("No Posts Available");
        this.posts = [];
        this.isLoading = false;
      }
    });
    

   }

  ngOnInit(): void {
  }

}
