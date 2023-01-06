import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: any;
    loading = false;
    submitted = false;
    returnUrl: string | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
    ) {
        // redirect to home if already logged in
        if (this.accountService.currentUser$) {
            this.router.navigate(['/app-home']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
          UserName: ['', Validators.required],
          Password: ['', Validators.required]
        });

    }

    get f() { return this.loginForm!.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm!.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.login(this.loginForm!.value).subscribe({
          next: _ => {
            this.router.navigateByUrl('/app-home');
            this.loginForm = {};
          }, error: error => {
            console.log('Handling login error', error);
          } 
        })
            
    }

}
