import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountService } from '../_services/account.service';
import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../_models/userInfo';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  baseUrl = environment.apiUrl;
  private RefreshSuccess!: Observable<boolean | undefined>;
  constructor(private router: Router, private accountService: AccountService, private http: HttpClient, private jwtHelper: JwtHelperService) { }

  canActivate(): Promise<boolean> | Observable<boolean> {

    let Token = localStorage.getItem('token');

    let isref: Observable<boolean>;

    if (this.accountService.currentUser$ && Token && !this.accountService.tokenExpired(Token)) {
      console.log(this.jwtHelper.decodeToken(Token));
      return of(true);
    }
    else {
      if(this.router.url == '/' ||  this.router.url == '/app-register')
      {
      this.router.navigateByUrl(this.router.url.toString());
      return of(false);
      }
      const isRefreshSuccess = this.accountService.tryRefreshingTokens(Token!);
      if (!isRefreshSuccess) {
        this.router.navigateByUrl('/');
      }
      return isRefreshSuccess;
    }

  }
}