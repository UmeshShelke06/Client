import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { HomeComponent } from './Home/home/home.component';
import { MemberComponent } from './member/member/member.component';
import { AuthGuard } from './_guard/auth.guard';

const routes: Routes = [
  {path: 'app-home', component: HomeComponent,canActivate: [AuthGuard]},
  {path: '', component: LoginComponent},
  {path: 'app-register', component: RegisterComponent},
  {path: 'app-member', component: MemberComponent,canActivate: [AuthGuard]}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
