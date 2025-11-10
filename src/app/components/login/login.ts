/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    this.loginError = '';

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const loginSuccessful = this.authService.login(email, password);

      if (loginSuccessful) {
        console.log('Success login, redirecting...');
        this.router.navigate(['/home']);
      } else {
        this.loginError = 'Incorrect email or password. Please, try again';
      }
    } else {
      this.loginError = 'Complete all fields, please'
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/