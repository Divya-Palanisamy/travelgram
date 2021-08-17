import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { faThumbsUp, faThumbsDown, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnChanges {

  @Input()
  post;

  thumbsUp = faThumbsUp;
  thumbsDown = faThumbsDown;
  share = faShareSquare;
  map = faMapMarkerAlt;



  uid = null;
  
  like: number = 0;
  dislike: number = 0;

  constructor(
    private auth: AuthService,
    private db: AngularFireDatabase
  ) { 
    auth.getUser().subscribe((user) => {
      this.uid = user.uid;
    })
  }

  ngOnInit(): void {
  }
  
  ngOnChanges(): void{

    if(this.post.vote){
      Object.values(this.post.vote).map((val: any) => {
        if(val.like){
          this.like += 1;
        }
        if(val.dislike){
          this.dislike += 1;
        }
      })
    }
  }

  likePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      like: 1,
    });
  }

  dislikePost(){
    this.db.object(`/posts/${this.post.id}/vote/${this.uid}`)
    .set({
      dislike: 1,
    });
  }

  instaUrl(){
    return `https://instagram.com/${this.post.username}`;
  }
}
