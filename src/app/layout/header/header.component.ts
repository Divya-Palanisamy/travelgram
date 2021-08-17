import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email = null;
  username = null;
  uid = null;
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private db: AngularFireDatabase,
  ) { 
    auth.getUser().subscribe(
      (user) => {
        this.email = user?.email;
        this.uid = user?.uid;
      }
    );
    db.list('/users').snapshotChanges().forEach((users) => {
      users.forEach((usersnap) => {
        if(usersnap.key === this.uid){
          let user = usersnap.payload.toJSON();
          this.username = user['username'];
        }
      })
    });
    
  }

  ngOnInit(): void {
  }

  async logOut(){
    try{
      await this.auth.logOut();
      this.toastr.success("Login Again TO Continue");
      this.router.navigateByUrl("/signin");
      this.email = null;
    }
    catch(err){
      this.toastr.error("Logout Failed");
      console.log(err);
    }
  }


}
