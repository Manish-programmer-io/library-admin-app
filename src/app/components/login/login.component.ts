import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',  
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void{
    const {username, password} =this.loginForm.value;

    //Authentication Logic
    if (username === 'admin' && password === 'admin123'){
      this.router.navigate(['/dashboard']);
    }
    else{
      alert ('Wrong Username or Password')
    }
  }

}