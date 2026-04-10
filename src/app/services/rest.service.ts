import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';
import { AbstractService } from './abstract.service';
import { AuthResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class RestService extends AbstractService {

  private readonly persistence = inject(PersistenceService);

  private path: string | null = null;

  private async getPath(): Promise<any> {
    console.log('[Rest.getPath] INICIO'); //BORRAR LOG
    try {
      if (this.path !== null) {
        console.log('[Rest.getPath] Usando basePathCache:', this.path); //BORRAR LOG
        return this.path;
      }

      const customer = await this.persistence.getValue('customer');
      console.log('[Rest.getPath] customer obtenido:', customer); //BORRAR LOG

      this.path = customer
        ? environment.urlPrefix.replace('$CUSTOMER$', customer) + environment.apiUrl
        : '';

      console.log('[Rest.getPath] basePathCache generado:', this.path); //BORRAR LOG
      console.log('[Rest.getPath] FIN'); //BORRAR LOG

      return this.path;
    } catch (error) {
      console.error('[restService][getPath]', error);
    }

  }

  async login(username: string, password: string): Promise<any> {
    try {
      const basePath = await this.getPath();
      const response = await this.makePostRequestWithoutHeaders(`${basePath}authenticate`, {
        username,
        password
      });

      // Si el login es correcto, guardamos el token en un archivo 'token.json'
      if (response && response.token) {
        await this.persistence.setValue('token', response.token);
        await this.persistence.setValue('userLogged', response.user); // Guardamos el usuario
      }

      return response;
    } catch (error) {
      console.error('[RestService][login]', error);
      throw error;
    }
  }

  async cleanAllData(): Promise<boolean> {
    this.path = null; // Limpiamos caché de URL
    return await this.persistence.resetValues(); // Borra todos los .json
  }
}