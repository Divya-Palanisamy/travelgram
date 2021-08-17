import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { v4 } from "uuid";
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from "src/utils/config";


@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {

  location: string;
  caption: string;
  picture: string = null;
  

  user = null;
  uploadPercent: number = null;

  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private auth: AuthService,
    private toastr: ToastrService,
    private router: Router,
  ) { 
    auth.getUser().subscribe(
      (user) => {
        this.db.object(`/users/${user.uid}`)
        .valueChanges()
        .subscribe(
          (user) => {
            this.user = user;
          }
        )
      }
    )
  }

  ngOnInit(): void {
  }

  onSubmit(){
    const uid = v4();

    this.db.object(`/posts/${uid}`)
    .set({
      id: uid,
      location: this.location,
      caption: this.caption,
      picture: this.picture,
      by: this.user.name,
      instaId: this.user.username,
      date: Date.now()
    })
    .then(() => {
      this.toastr.success("Uploaded");
      this.router.navigateByUrl('/');
    })
    .catch(() => {
      this.toastr.error("Upload Failed");
    })
  }
  async uploadFile(event) {
    const file = event.target.files[0];

    let resizedImage = await readAndCompressImage(file, imageConfig);

    const filePath = v4();
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe((percentage) => {
      this.uploadPercent = percentage;
    });

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.picture = url;
          this.toastr.success("Image upload Success");
        });
      }),
    ).subscribe();
  }
}
