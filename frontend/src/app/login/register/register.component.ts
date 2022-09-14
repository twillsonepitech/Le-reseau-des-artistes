import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  public registerForm: FormGroup;

  constructor(
    private builder:FormBuilder,
    private authService:AuthService,
    private router:Router,
  ) { 
   this.registerForm =  this.builder.group({
      emailCtrl: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),
      nameCtrl: new FormControl('', Validators.required),
      passwordCtrl: new FormControl('', Validators.required),
      rpasswordCtrl: new FormControl('', Validators.required),
    })
  }

  goToLogin(){
     this.router.navigate(['init/login']);
  }

  register():void {
    if(this.registerForm.valid){
      this.authService.register(
      this.registerForm.get('nameCtrl')?.value,
      this.registerForm.get('emailCtrl')?.value,
      this.registerForm.get('passwordCtrl')?.value,
      ).pipe(
        tap((res) =>{
          this.router.navigate(['home']);
        })
      ).subscribe();
    }
  }

}
