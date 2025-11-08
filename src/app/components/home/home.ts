import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent implements OnInit {

  // Inyección moderna de dependencias (Angular 14+)
  private authService = inject(AuthService);
  private router = inject(Router);

  // Propiedades para almacenar la información del usuario
  username: string | null = null;
  userEmail: string | null = null;

  ngOnInit(): void {
    // 1. Obtener el username al inicializar el componente
    this.username = this.authService.getCurrentUsername();

    // 2. Obtener el email para mostrar más info (opcional)
    this.userEmail = localStorage.getItem('currentUserEmail');
  }

  // Método que se llama al hacer clic en el botón de cerrar sesión
  onLogout(): void {
    this.authService.logout(); // Llama al servicio para limpiar LocalStorage
    this.router.navigate(['/']); // Redirige a la página de bienvenida (raíz)
  }


}
