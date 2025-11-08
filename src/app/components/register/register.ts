// src/app/components/register/register.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  
  // Usaremos esta variable para mensajes de ÉXITO y de ERROR
  message: string = ''; 
  isError: boolean = false; // Indica si el mensaje es un error (para estilos)

  // 🎯 CLAVE DE ALMACENAMIENTO CORREGIDA para coincidir con AuthService
  private readonly STORAGE_KEY = 'registeredUsers';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['',
        [
          Validators.required,
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
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{8,16}$/)
        ]
      ],
      password2: ['', Validators.required]
    });
  }

  onSubmit() {
    // 1. Limpiar mensajes
    this.message = '';
    this.isError = false;

    if (this.registerForm.valid) {
      const { username, email, password1, password2 } = this.registerForm.value;
      
      // Validacion: coincidencia de contraseñas
      if (password1 !== password2) {
        this.message = 'Error: Las contraseñas no coinciden.';
        this.isError = true;
        return;
      }
      
      // 2. Obtener usuarios existentes en LocalStorage usando la clave CORRECTA
      // Usamos 'STORAGE_KEY' en lugar de 'user' o 'users'
      const users = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      
      // Validamos que el email sea único
      const emailExists = users.some((u: any) => u.email === email);
      if (emailExists) {
        this.message = 'Error: Ya existe un usuario registrado con ese correo.';
        this.isError = true;
        return;
      }
      
      // Crear un nuevo usuario
      const newUser = {
        id: Date.now(),
        username,
        email,
        password: password1 // El AuthService busca la propiedad 'password'
      };

      // 3. Guardar en LocalStorage usando la clave CORRECTA
      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))
      
      // Mostrar mensaje de exito
      this.message = `¡Registro exitoso! Bienvenido a Virtualknowledge, ${username}.`;
      this.isError = false; // Mensaje de éxito

      // Resetear el formulario después del éxito
      this.registerForm.reset();
    }
  }

  ngOnInit() {
    // Si necesitas un formulario dinámico, lo pones aquí.
  }
}