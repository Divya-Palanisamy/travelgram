import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireStorage } from "@angular/fire/storage";
import { AngularFireDatabase } from "@angular/fire/database";
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { finalize } from "rxjs/operators";
import { readAndCompressImage } from "browser-image-resizer";
import { imageConfig } from 'src/utils/config';
import { v4 } from "uuid";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  photo: string = "https://cutt.ly/bQCxiV6";
  uploadPercent: number = null;
  constructor(
    private auth: AuthService,
    private toastr: ToastrService,
    private storage: AngularFireStorage,
    private db: AngularFireDatabase,
    private router: Router,

  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){
    const { name, username, email, password, bio, country} = f.form.value;

    this.auth.signUp(email, password)
    .then(
      (res) => {
        const { uid } = res.user;

        this.db.object(`/users/${uid}`)
        .set(
          {
          id: uid,
          name: name,
          username: username,
          email: email,
          password: password,
          bio: bio,
          country: country,
          photo: this.photo,
          }
        )
      })
    .then( () => {
      this.toastr.success("SignUp Success");
      this.router.navigateByUrl('/');
    }
    )
    .catch((err) => {
      this.toastr.error("SignUp Failed");
    })
  }


  async uploadImage(event){
    const file = event.target.files[0];
    
    let resizedImage = await readAndCompressImage(file,imageConfig);

    
    const filePath = v4() ;

 
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, resizedImage);

    task.percentageChanges().subscribe(
      (percentage) => {
        this.uploadPercent = percentage;
      }
    );

    task.snapshotChanges()
    .pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.photo = url;
          this.toastr.success("Image Uploaded");
        })
      })
    )
    .subscribe();

  }

}
