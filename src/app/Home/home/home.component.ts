import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';
import { BehaviorSubject, Observable, Subject, of, from, takeUntil, timer, switchMap, catchError } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  destroyed$: Subject<any> = new Subject();

  constructor(public accountservice: AccountService, private router: Router) { }


  ngOnInit(): void {
    this.setSessionTimeout();
  }

  logOut() {
    this.accountservice.logout();
    this.router.navigateByUrl('/');
  }


  gotoMember() {
    this.router.navigateByUrl('/app-member');
  }

  displaySessionWarning() {
    console.log('displaySessionWarning');
    this.accountservice.findsessionTime();
  }



  setSessionTimeout() {
    var timerObserv = timer(3000); 
    timerObserv.pipe(takeUntil(this.destroyed$)).subscribe(x => {
      this.accountservice.findsessionTime();
    });
  }


  ngOnDestroy(){
    this.destroyed$.next(false);
  }
}

