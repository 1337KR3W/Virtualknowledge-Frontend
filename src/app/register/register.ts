import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
//ReactiveFormsModule: modulo que habilita el uso de formularios reactivos en Angular.
//FormBuilder: Servicio que te ayuda a crear formularios de forma más concisa.
//FormGroup: Representa el formulario como un grupo de controles.
//Validators: Conjunto de validaciones que puedes aplica a los campos del formulario.

@Component({
  selector: 'app-register',//Nombre del componente
  standalone: true,//Componente que no depende de ningún módulo
  imports: [CommonModule, ReactiveFormsModule],//Qué módulos nativos necesita este componente para funcionar
  templateUrl: './register.html',//Ruta HTML
  styleUrl: './register.scss',//Ruta CSS
})

//Declaro una propiedad RegisterComponent que será el formulario reactivo.
export class RegisterComponent {
  registerForm: FormGroup;

  //Empleamos módulo FormBuilder para crear el formulario
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],//Validación de campos con el valor vacío ''
      email: ['', [Validators.required, Validators.email]],//Required hace referencia a campos obligatorios
      password: ['', Validators.required]
    });
  }
  //Método que se ejecuta al enviar el formulario.
  //Si el formualario es válido, imprime los datos en consola.
  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
  }
}

