import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  ) { }

  ngOnInit(): void {
  }

  navigateToProfile(){
    this.router.navigateByUrl('/profile').then(() => {
      window.location.reload();
    });
  }
}
