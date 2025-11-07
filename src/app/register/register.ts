import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  successMessage: string = '';

  //Empleamos módulo FormBuilder para crear el formulario
  //En formularios dinámicos lo ideal seria emplear ngOnInit()
  //Required hace referencia a campos obligatorios, los cuales se comparan con el valor vacio ''
  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]{4,16}$/)//Validacion: usuario compuesto de letras y numeros de 1 a 16 caracteres
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
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[.@$!%*?&])[A-Za-z\d.@$!%*?&]{8,16}$/)//Validacion: almenos 1 numero 1 mayuscula y 1 caracter especial, minimo 8 caracteres y maximo 16
        ]
      ],
      password2: ['', Validators.required]
    });
  }
  //Método que se ejecuta al enviar el formulario.
  //Si el formualario es válido, imprime los datos en consola.
  onSubmit() {//Empleamos una base de datos en memoria LocalStorage
    if (this.registerForm.valid) {
      const { username, email, password1, password2 } = this.registerForm.value;
      //Validacion: coincidencia de contraseñas
      if (password1 != password2) {
        //alert('Las contraseñas no coinciden.');
        return;
      }
      //Obtenemos usuarios existentes en LocalStorage
      const users = JSON.parse(localStorage.getItem('user') || '[]');
      //Validamos que el email sea único
      const emailExists = users.some((u: any) => u.email === email);
      if (emailExists) {
        alert('Ya existe un usuario registrado con ese correo.');
        return;
      }
      //Creamos un nuevo usuario
      const newUser = {
        id: Date.now(),
        username,
        email,
        password: password1
      };

      //Guardar en LocalStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users))
      //Mostrar mensaje de exito
      this.successMessage = `Welcome to Virtualknowledge, ${username}!`;

      //Resetear el formulario
      this.registerForm.reset();
    }
  }

  ngOnInit() {
    //Vacío de momento, se completará cuando se necesite un formulario dinámico
  }


}

