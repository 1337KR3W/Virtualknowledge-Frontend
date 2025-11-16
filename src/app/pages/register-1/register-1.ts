import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-1',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Material Modules for new template
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './register-1.html',
  styleUrl: './register-1.scss',
})
export class Register1Page implements OnInit {

  registerForm1: FormGroup;
  message: string = '';
  isError: boolean = false;

  // CLAVE DE ALMACENAMIENTO para coincidir con AuthService
  private readonly STORAGE_KEY = 'registeredUsers';

  // Añadido Router para poder navegar de vuelta a login después del registro
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm1 = this.fb.group({
      username: ['',
        [
          Validators.required,
          // 4 a 16 caracteres alfanuméricos
          Validators.pattern(/^[a-zA-Z0-9]{4,16}$/)
        ]
      ],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password1: ['',
        [
          Validators.required,
          // 8 a 16 chars, 1 mayús, 1 número, 1 especial
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{8,16}$/)
        ]
      ],
      password2: ['', Validators.required]
    });
  }

  onSubmit() {
    this.message = '';
    this.isError = false;

    if (this.registerForm1.valid) {
      const { username, email, password1, password2 } = this.registerForm1.value;

      // Validacion: coincidencia de contraseñas
      if (password1 !== password2) {
        this.message = 'Error: Passwords do not match.';
        this.isError = true;
        return;
      }

      // Obtener usuarios existentes
      const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');

      // Validamos que el email sea único
      const emailExists = users.some((u: any) => u.email === email);
      if (emailExists) {
        this.message = 'Error: There is already a registered user with that email.';
        this.isError = true;
        return;
      }

      // Crear y guardar un nuevo usuario
      const newUser = {
        id: Date.now(),
        username,
        email,
        password: password1
      };

      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))

      // Mostrar mensaje de exito y navegar
      this.message = `Successful registration! Welcome to Virtualknowledge, ${username}.`;
      this.isError = false;

      // Limpiamos el formulario y navegamos a login después de un breve retraso
      this.registerForm1.reset();
      setTimeout(() => {
        this.router.navigate(['/login-1']);
      }, 3000); // Redirecciona después de 2 segundos para que el usuario vea el mensaje de éxito

    } else {
      // Marcar todos los campos como tocados para que se muestren los errores
      this.registerForm1.markAllAsTouched();
      this.message = 'Please complete all required fields correctly.';
      this.isError = true;
    }
  }

  // Nuevo método para volver al login
  goToLogin() {
    this.router.navigate(['/login-1']);
  }

  ngOnInit() {
    // Si necesito un formulario dinamico, poner aquí.
  }
}