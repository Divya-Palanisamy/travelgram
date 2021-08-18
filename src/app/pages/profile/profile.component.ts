import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from 'src/app/services/auth.service';
import { faMailBulk, faUserAlt, faPlaneArrival} from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userid = null;
  user = null;
  posts = [];
   
  username = null;

  name = faUserAlt
  mail = faMailBulk;
  bio = faAddressCard;
  country = faPlaneArrival;
  map = faMapMarkerAlt;



  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase,
  ) {
    this.userid = auth.getUserId();
     
       db.list('/users').snapshotChanges().forEach((users) => {
        
        users.forEach((usersnap) => {
          if(usersnap.key === this.userid){

            this.user = usersnap.payload.toJSON();
            this.username = this.user.username;

          }
        });
      });     

      db.list('/posts').snapshotChanges().forEach((post) => {
        
        post.forEach((postsnap) => {
          let tempPost = postsnap.payload.toJSON();
          if(tempPost['userid'] === this.userid){
            this.posts.push(tempPost);
          }
        });
      });
   }

  ngOnInit(): void {
  
  }

  instaUrl(){
    
    return `https://instagram.com/${this.username}`;
  }

}
