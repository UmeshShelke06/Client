import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public accountservice: AccountService,private router:Router) { }

  ngOnInit(): void {
  }

  logOut()
  {
    this.accountservice.logout();
    this.router.navigateByUrl('/');
  }


  gotoMember()
  {
    this.router.navigateByUrl('/app-member');
  }

}
