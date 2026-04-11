import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';
import { AbstractService } from './abstract.service';
import { UserDTO } from '../models/userDTO.model';
import { VersionDTO } from '../models/versionDTO.model';
import { ProjectDTO } from '../models/projectDTO.model';
import { TimeSheetDTO } from '../models/timeSheetDTO.model';

@Injectable({ providedIn: 'root' })
export class RestService extends AbstractService {

  private readonly persistence = inject(PersistenceService);
  private path: string | null = null;

  /**
   * Genera la URL base limpia (Protocolo + Host + Prefijo)
   */
  private async getPath(): Promise<string> {
    if (this.path !== null) return this.path;

    const customer = await this.persistence.getValue('customer');
    let baseUrl = environment.urlPrefix || '';

    if (customer && baseUrl.includes('$CUSTOMER$')) {
      baseUrl = baseUrl.replace('$CUSTOMER$', customer);
    }

    // Unimos el prefijo con la URL de la API del environment
    let finalUrl = baseUrl + environment.apiUrl;

    // Regex para limpiar dobles slashes evitando romper el http://
    this.path = finalUrl.replace(/([^:]\/)\/+/g, "$1");

    return this.path;
  }

  // --- MÉTODOS DE AUTENTICACIÓN (/auth) ---

  async login(email: string, password: string): Promise<any> {
    const basePath = await this.getPath();
    // Importante: El login SIEMPRE cuelga de /auth/
    return this.makePostRequestWithoutHeaders(`${basePath}auth/login`, {
      email,
      password
    });
  }

  // --- MÉTODOS DE USUARIO (/user) ---

  async getUserProfile(id: number): Promise<UserDTO> { //
    const basePath = await this.getPath();
    // Ahora la URL llevará el ID al final: /user/profile/1
    return this.makeGetRequest<UserDTO>(`${basePath}user/profile/${id}`);
  }

  // --- MÉTODOS DE SISTEMA (/system) ---

  async getVersion(): Promise<VersionDTO> {
    const basePath = await this.getPath();
    // Coincide con el nuevo SystemController del backend
    return this.makeGetRequest<VersionDTO>(`${basePath}system/version`);
  }

  // --- METODOS DE PROYECTOS (/project) ---
  async getProjectsByUserId(userId: number): Promise<ProjectDTO[]> {
    console.log('[REST] Intentando obtener path...');
    const basePath = await this.getPath();
    console.log('[REST] Path obtenido:', basePath, 'Lanzando GET...');

    const url = `${basePath}projects/user/${userId}`;
    console.log('[REST] URL final construida:', url);

    return this.makeGetRequest<ProjectDTO[]>(url);
  }

  async getProjectsByUserIdAndWeek(userId: number, weekId: string): Promise<ProjectDTO[]> {
    // Ajustamos la URL para que coincida con: /user/{userId}/week/{weekId}
    const url = `${await this.getPath()}projects/user/${userId}/week/${weekId}`;

    // Usamos el método que ya tengas para peticiones GET (suponiendo que devuelve un Promise)
    return this.makeGetRequest<ProjectDTO[]>(url);
  }

  // --- MÉTODOS DE TIMESHEET (/timesheet) ---
  async saveTimeSheet(timeSheet: TimeSheetDTO, userId: number): Promise<void> {
    const basePath = await this.getPath();

    // Enriquecemos el objeto con el userId antes de enviar
    // (Aunque lo ideal es sacarlo del token en el back, esto asegura la carga)
    const payload = {
      weekId: timeSheet.weekId,
      globalComment: timeSheet.globalComment,
      rows: timeSheet.rows,
      userId: userId // <--- Este campo debe existir en tu TimeSheetRequestDTO.java
    };

    return this.makePostRequest(`${basePath}timesheet/save`, payload);
  }

  async getTimeSheetByWeek(weekId: string, userId: number): Promise<TimeSheetDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<TimeSheetDTO>(`${basePath}timesheet/week/${weekId}/user/${userId}`);
  }

  // --- UTILIDADES ---

  async cleanAllData(): Promise<boolean> {
    this.path = null;
    return await this.persistence.resetValues();
  }
}