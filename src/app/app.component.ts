import { Component } from '@angular/core';
import { BnNgIdleService } from 'bn-ng-idle';
import { AccountService } from './_services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Client';


  constructor(private bnIdle: BnNgIdleService,public accountservice: AccountService) {

  }

  
  ngOnInit(): void {
    this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.accountservice.findsessionTime();
      }
    });
  }
}
