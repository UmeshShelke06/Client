import { Component, OnInit } from '@angular/core';
import { UserInform } from 'src/app/_models/UserInform';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  userInform?: UserInform;
  userInformUserName?: string[];
  userDetailCol?: UserInform[];
  constructor(public accountService:AccountService) { }

  ngOnInit(): void {
    this.LoadMemberData();
    //this.accountService.findsessionTime();
  }


  LoadMemberData()
  {
  this.accountService.GetUsers().subscribe({
    next: response => {

      this.userDetailCol = response;
      console.log('userDetailCol IN GetUsers', this.userDetailCol);

    }, error: error => {
      console.log('Handling LoadMemberData error', error);
    } 
  })
}
  
Revoke()
  {
  this.accountService.GetRevoke().subscribe({
    next:  d => {
      console.log('Revoke succesful', d);
    }, error: error => {
      console.log('Handling Revoke error', error);
    } 
  })
}

}
