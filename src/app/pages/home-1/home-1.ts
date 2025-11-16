import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../services/auth';

// El servicio de autenticación debe estar en la ruta correcta, o ser proporcionado en 'root'
// Suponemos que la ruta es correcta o se provee globalmente
// import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-home-1',
  imports: [
    CommonModule,
    RouterModule,
    // Módulos de Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule
  ],
  templateUrl: './home-1.html',
  styleUrl: './home-1.scss', // Mantengo el styleUrl por si tienes estilos específicos
})
export class Home1Page implements OnInit {

  // Asumimos que AuthService es accesible globalmente (providedIn: 'root')
  // Para que este código compile, debes asegurarte de que 'AuthService' exista
  // Reemplaza 'any' por tu AuthService real si está en un path no localizable
  private authService = inject(AuthService);
  private router = inject(Router);

  // Propiedades para almacenar la información del usuario
  username: string | null = null;
  userEmail: string | null = null;

  ngOnInit(): void {
    // 1. Obtener el username al inicializar el componente
    // Nota: Si usas la versión inyectada 'this.authService', asegúrate que el servicio es mockeado 
    // o está disponible para el inject. Usaré el método del localStorage directamente 
    // para asegurar la ejecución, si el inject falla.

    // Si usas tu AuthService real, descomenta:
    this.username = this.authService.getCurrentUsername();
    this.userEmail = localStorage.getItem('currentUserEmail');

    // Usando localStorage directamente (más robusto en este entorno)
    this.username = localStorage.getItem('currentUsername');
    this.userEmail = localStorage.getItem('currentUserEmail');
  }

  // Método que se llama al hacer clic en el botón de cerrar sesión
  onLogout(): void {
    // Si usas tu AuthService real, descomenta:
    this.authService.logout();

    // Limpieza de localStorage directamente (más robusto en este entorno)
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUsername');

    this.router.navigate(['/']); // Redirige a la página de bienvenida (raíz)
  }
}