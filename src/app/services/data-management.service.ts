import { inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { PersistenceService } from './persistence.service';
import { UserDTO } from '../models/userDTO.model';
import { VersionDTO } from '../models/versionDTO.model';
import { ProjectDTO } from '../models/projectDTO.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataManagementService {
  private readonly rest = inject(RestService);
  private readonly persistence = inject(PersistenceService);
  public showBackButton = new BehaviorSubject<boolean>(false);

  async login(username: string, password: string): Promise<[UserDTO, VersionDTO]> {

    const authResponse = await this.rest.login(username, password);

    if (!authResponse?.token) {
      throw new Error('LOGIN_ERROR: No token received');
    }
    const userId = authResponse.id;

    // CORRECCIÓN: Usamos el string 'token' (miembro de StorageKey)
    await this.persistence.setValue('token', authResponse.token);

    // 2. Carga paralela de datos tras el login
    const [userLogged, version] = await Promise.all([
      this.loadUserLogged(userId),
      this.loadProxyVersion()
    ]);

    return [userLogged, version];
  }

  /**
   * Obtiene los datos del perfil del usuario usando el token guardado
   */
  async loadUserLogged(userId: number): Promise<UserDTO> {
    const user = await this.rest.getUserProfile(userId);
    await this.persistence.setValue('userLogged', user);
    return user;
  }

  /**
   * Obtiene la versión del backend
   */
  async loadProxyVersion(): Promise<VersionDTO> {
    const version = await this.rest.getVersion();
    await this.persistence.setValue('lastSync', new Date().toISOString());
    return version;
  }

  async logout(): Promise<void> {
    await this.rest.cleanAllData();
  }


  async getToken(): Promise<string> {
    const token = await this.persistence.getValue('token');
    console.log('[DM.getToken] Token recuperado (ocultado):', token ? 'OK' : 'NULL'); //BORRAR LOG
    return token;
  }

  async setValueFromStorage(key: string, value: unknown): Promise<void> {
    console.log('[DM.setValueFromStorage] Guardando clave:', key, 'valor:', value); //BORRAR LOG
    await this.persistence.setValue(key, value);
    console.log('[DM.setValueFromStorage] Guardado OK'); //BORRAR LOG
  }

  async getValueFromStorage<T>(key: string): Promise<T | null> {
    const val = await this.persistence.getValue(key);
    console.log('[DM.getValueFromStorage] Leyendo clave:', key, '→', val); //BORRAR LOG
    return val;
  }

  async getProjects(userId: number): Promise<ProjectDTO[]> {
    console.log('[DM] 4. Solicitando proyectos al RestService para ID:', userId);
    try {
      const projects = await this.rest.getProjectsByUserId(userId);
      console.log('[DM] 5. Respuesta del RestService recibida, guardando en persistencia...');
      await this.persistence.setValue('last_projects_list', projects);
      return projects;
    } catch (error) {
      console.error('[DM.getProjects] Error al recuperar proyectos:', error);
      throw error;
    }
  }

  setBackButton(value: boolean) {
    this.showBackButton.next(value);
  }
}