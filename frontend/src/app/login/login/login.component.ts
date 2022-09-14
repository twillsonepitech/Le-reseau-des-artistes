import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public loginForm: FormGroup;

  constructor(
    private builder:FormBuilder,
    private authService:AuthService,
    private router:Router,
  ) { 
   this.loginForm =  this.builder.group({
      emailCtrl: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),
      passwordCtrl: new FormControl('', Validators.required),
    });
  }

  goToRegister():void {
    this.router.navigate(['/init/register']);
  }

  login():void {
    if(this.loginForm.valid){
      this.authService.login(
      this.loginForm.get('emailCtrl')?.value,
      this.loginForm.get('passwordCtrl')?.value,
      ).pipe(
        switchMap(() => this.authService.me()),
        tap((res) =>{
          this.router.navigate(['home']);
        })
      ).subscribe();
    }
  }
}
