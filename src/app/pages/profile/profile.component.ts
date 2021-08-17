import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/services/auth.service';
import { faMailBulk, faUserAlt, faPlaneArrival} from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  uid = null;
  user = null;
  username = null;

  name = faUserAlt
  mail = faMailBulk;
  bio = faAddressCard;
  country = faPlaneArrival;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
  ) {
    auth.getUser().subscribe(
      (user) => {
        this.uid = user?.uid;
      }
    );

    db.list('/users').snapshotChanges().forEach((users) => {
      users.forEach((usersnap) => {
        if(usersnap.key === this.uid){
          this.user = usersnap.payload.toJSON();
          this.username = this.user['username'];
        }
      })
    });

   }

  ngOnInit(): void {
  }

  instaUrl(){
    return `https://instagram.com/${this.username}`;
  }

}
