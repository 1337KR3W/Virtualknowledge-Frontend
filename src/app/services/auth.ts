import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly STORAGE_KEY = 'registeredUsers';

  //Constructor vacio
  constructor() { }

  /** TSDoc -> Documentacion de TypeScript para el metodo login()
   * Intenta iniciar sesión.
   * @param email El email del usuario.
   * @param password La contraseña del usuario.
   * @returns true si el login es exitoso, false en caso contrario.
   */

  login(email: string, password: string): boolean {
    const usersJson = localStorage.getItem(this.STORAGE_KEY);
    //Comprobacion: si no existen usuarios devolvemos el mensaje
    if (!usersJson) {
      console.warn('No user in LocalStorage');
      return false;
    }

    const users: any[] = JSON.parse(usersJson);
    const user = users.find(u => u.email === email);

    //Comprobacion: Si el usuario existe y la password coincide, entonces...
    if (user && user.password === password) {
      //Guardamos el username para la bienvenida
      localStorage.setItem('currentUsername', user.username);
      //Guardamos el email para la sesión
      localStorage.setItem('currentUserEmail', user.email);
      return true;
    }

    return false;
  }
  //Obtener el username del usuario logueado
  getCurrentUsername(): string | null {
    return localStorage.getItem('currentUsername');
  }

  // Opcional: Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('currentUsername');
  }

  // Opcional: Método para verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUserEmail');
  }


}
