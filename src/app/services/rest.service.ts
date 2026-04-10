import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';
import { AbstractService } from './abstract.service';

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
      console.log('[Rest.login] POST →', `${basePath}authenticate`, { username }); //BORRAR LOG

      return this.makePostRequestWithoutHeaders(`${basePath}authenticate`, {
        username,
        password
      });
    } catch (error) {
      console.error('[restService][login]', error);
    }

  }
}