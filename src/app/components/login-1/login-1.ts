import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-login-1',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './login-1.html',
  styleUrl: './login-1.scss',
})
export class Login1Page {
  loginForm1: FormGroup;
  loginError: string = '';



  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm1 = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin() {
    console.log('--- 1. FUNCIÓN onLogin DISPARADA ---'); // <-- Añade esto
    this.loginError = '';

    if (this.loginForm1.valid) {
      console.log('--- 2. FORMULARIO VÁLIDO ---'); // <-- Añade esto
      const { email, password } = this.loginForm1.value;
      const loginSuccessful = this.authService.login(email, password);

      if (loginSuccessful) {
        console.log('--- 3. LOGIN ÉXITO, REDIRECCIONANDO ---');
        console.log('Success login, redirecting...');
        this.router.navigate(['/home']);
      } else {
        console.log('--- 4. LOGIN FALLIDO ---');
        this.loginError = 'Incorrect email or password. Please, try again';
      }
    } else {
      console.log('--- 5. FORMULARIO INVÁLIDO ---');
      this.loginError = 'Complete all fields, please'
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
