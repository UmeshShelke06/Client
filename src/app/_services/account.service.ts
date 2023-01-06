import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginInfo } from '../_models/loginInfo';
import { RegisterInfo } from '../_models/registeInfo';
import { TokenInfo } from '../_models/TokenInfo';
import { UserInfo } from '../_models/userInfo';
import { UserInform } from '../_models/UserInform';



@Injectable({
  providedIn: 'root'
})
export class AccountService {
  [x: string]: any;

  baseUrl = environment.apiUrl;
  refreshToken!: string;

  private currentUserSource = new BehaviorSubject<UserInfo | null>(null);

  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient,private toastr: ToastrService) { }

  login(LoginInfod: LoginInfo) {
    return this.http.post<UserInfo>(this.baseUrl + 'account/login', LoginInfod).pipe(
      map((response: UserInfo) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(RegisterInfo: RegisterInfo) {
    return this.http.post<UserInfo>(this.baseUrl + 'account/register', RegisterInfo).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }


  GetUsers() {
    return this.http.get<UserInform[]>(this.baseUrl + 'account/GetUsers');
    // .pipe(
    //   map(UserInform => {
    //     if (UserInform) {
    //       return UserInform;
    //     }
    //   })
    // )
  }

  setCurrentUser(user: UserInfo) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    localStorage.setItem('refreshToken', user.refreshToken);
    this.currentUserSource.next(user);

  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]))
  }

  tokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    console.log(' Token expiry', expiry);
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  
 findsessionTime() {
  var tokenValue = localStorage.getItem('token') as string;
  const jwtToken = JSON.parse(atob(tokenValue.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    console.log(' Token expiry actual time', expires);
    const timeout = expires.getMinutes() - new Date().getMinutes();
    console.log(' Token expiry timeout in mIn', timeout);
    this.toastr.warning('your session Time is going to expire in ' + timeout + 'min');
    //this.toastr.success('');
    return timeout;

 }

  public async tryRefreshingTokens(token: string): Promise<boolean> {
    var refreshToken = localStorage.getItem("refreshToken") as string;    
    var TokenAPIModel = { 
     AccessToken: token,
     RefreshToken: refreshToken
  };
  console.log('before ref TokenAPIModel', TokenAPIModel);
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    let isRefreshSuccess: boolean;
    const refreshRes = await new Promise<UserInfo>((resolve, reject) => {
      this.http.post<UserInfo>(this.baseUrl + 'Token/Refresh', TokenAPIModel, {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe({
        next: (res: UserInfo) => resolve(res),
        error: (_) => { reject; isRefreshSuccess = false;}
      });
    });
    this.setCurrentUser(refreshRes);
    console.log('after refreshRes', refreshRes);
    isRefreshSuccess = true;
    return isRefreshSuccess;
  }

  GetRevoke(){
    return this.http
      .get(this.baseUrl + 'Token/Revoke');
  }

}

