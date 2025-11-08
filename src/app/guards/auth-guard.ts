// src/app/guards/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
 * Functional Guard para proteger rutas.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // Inyección de dependencias dentro del guard funcional
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar el estado de autenticación
  if (authService.isLoggedIn()) {
    // El usuario ha iniciado sesión. Permitir el acceso.
    return true; 
  } else {
    // El usuario NO ha iniciado sesión.
    // 2. Redirigir a la página de login.
    router.navigate(['/login']);
    return false; // Bloquear el acceso a la ruta.
  }
};