import { inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { PersistenceService } from './persistence.service';
import { tap } from 'rxjs';
import { UserDTO } from '../models/userDTO.model';
import { VersionDTO } from '../models/versionDTO.model';
import { AppDataModel } from '../models/appData.model';

@Injectable({ providedIn: 'root' })
export class DataManagementService {
  private readonly rest = inject(RestService);
  private readonly persistence = inject(PersistenceService);

  /**
   * Login del usuario, guarda el token y carga los datos necesarios para la sesión
   */
  async login(username: string, password: string): Promise<[UserDTO, VersionDTO]> {
    console.log('[DM.login] Intentando login con usuario:', username); //BORRAR LOG

    const authResponse = await this.rest.login(username, password);
    console.log('[DM.login] Respuesta login:', authResponse);

    if (!authResponse?.token) {
      console.error('[DM.login] ERROR: token ausente');
      throw new Error('LOGIN_ERROR');
    }

    await this.persistence.setValue(AppDataModel.token, authResponse.token);
    console.log('[DM.login] Token guardado correctamente');

    const [userLogged, version] = await Promise.all([
      this.loadUserLogged(),
      this.loadProxyVersion()
    ]);

    console.log('[DM.login] Usuario y versión cargados:', { userLogged, version }); //BORRAR LOG

    return [userLogged, version];
  }

  /**
   * Limpia todos los datos de la sesión (Local/Production)
   */
  async logout(): Promise<void> {
    // Centralizamos la limpieza a través del RestService
    const success = await this.rest.cleanAllData();
    if (success) {
      console.log('Sesión local borrada correctamente');
      // Aquí podrías redirigir al login: this.router.navigate(['/login']);
    }
  }

}