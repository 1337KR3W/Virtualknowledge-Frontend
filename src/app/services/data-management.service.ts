import { inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { PersistenceService } from './persistence.service';
import { UserDTO } from '../models/userDTO.model';
import { VersionDTO } from '../models/versionDTO.model';
import { ProjectDTO } from '../models/projectDTO.model';
import { BehaviorSubject } from 'rxjs';
import { TimeSheetDTO } from '../models/timeSheetDTO.model';

@Injectable({ providedIn: 'root' })
export class DataManagementService {
  private readonly rest = inject(RestService);
  private readonly persistence = inject(PersistenceService);
  public showBackButton = new BehaviorSubject<boolean>(false);

  /**
   * LOGIN
   */
  async login(email: string, password: string): Promise<[UserDTO, VersionDTO]> {
    const authResponse = await this.rest.login(email, password);
    if (!authResponse?.token) {
      throw new Error('LOGIN_ERROR: No token received');
    }
    await this.persistence.setValue('token', authResponse.token);
    const [userLogged, version] = await Promise.all([
      this.loadUserLogged(authResponse.id),
      this.loadProxyVersion()
    ]);
    return [userLogged, version];
  }

  /**
   * Obtiene los datos del perfil del usuario usando el token guardado
   */
  async loadUserLogged(userId: number): Promise<UserDTO> {
    const user = await this.rest.getUserProfile(userId);
    console.log('[DM] Usuario cargado con roles:', user.roles);
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

  /**
 * Envía el TimeSheet al backend y actualiza la caché local
 */
  async saveTimeSheet(timeSheet: TimeSheetDTO): Promise<void> {
    try {
      const user = await this.getValueFromStorage<UserDTO>('userLogged');
      if (!user) throw new Error('No user logged in');

      console.log('[DM] Guardando TimeSheet para la semana:', timeSheet.weekId);

      await this.rest.saveTimeSheet(timeSheet, user.id);

      // Opcional: Guardar en persistencia local por si el usuario refresca
      await this.persistence.setValue(`timesheet_${timeSheet.weekId}`, timeSheet);

    } catch (error) {
      console.error('[DM.saveTimeSheet] Error al guardar:', error);
      throw error;
    }
  }

  /**
 * Obtiene la semana de trabajo. Primero intenta el servidor, si falla busca en local.
 */
  async getTimeSheet(weekId: string): Promise<TimeSheetDTO> {
    const user = await this.getValueFromStorage<UserDTO>('userLogged');
    if (!user) throw new Error('No user logged');

    try {
      const data = await this.rest.getTimeSheetByWeek(weekId, user.id);
      return data || new TimeSheetDTO(weekId);
    } catch (error) {
      console.warn('[DM] No se pudo recuperar del servidor, buscando en local...', error);
      const localData = await this.getValueFromStorage<TimeSheetDTO>(`timesheet_${weekId}`);
      return localData || new TimeSheetDTO(weekId);
    }
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

  async getProjects(userId: number, weekId: string): Promise<ProjectDTO[]> {
    console.log(`[DM] Solicitando proyectos para ID: ${userId} en la semana: ${weekId}`);
    try {
      const projects = await this.rest.getProjectsByUserIdAndWeek(userId, weekId);
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