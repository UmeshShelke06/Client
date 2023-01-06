import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: any = {};
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
      this.registerForm = this.formBuilder.group({
          UserName: ['', Validators.required],
          Password: ['', Validators.required],
          UserEmail: ['', Validators.required]
      });

  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
      this.submitted = true;
      if (this.registerForm.invalid) {
          return;
      }

      this.loading = true;
      this.accountService.register(this.registerForm.value).subscribe({
        next: _ => {
          this.router.navigateByUrl('/app-home');
          this.registerForm = {};
        }, error: error => {
          console.log('Handling register error', error);
        } 
      })
          
  }
}
