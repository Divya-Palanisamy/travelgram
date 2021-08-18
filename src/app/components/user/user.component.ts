import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @Input()
  user;
  constructor(
    private router: Router,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
  }

  navigateToProfile(){
    this.router.navigateByUrl('/profile');
    this.auth.passUser(this.user);
  }
}
