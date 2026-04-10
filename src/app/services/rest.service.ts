import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';
import { AbstractService } from './abstract.service';
import { UserDTO } from '../models/userDTO.model';
import { VersionDTO } from '../models/versionDTO.model';

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

  async getUserProfile(): Promise<UserDTO> {
    const basePath = await this.getPath();
    // Ya no lleva /auth/, ahora es un recurso de usuario
    return this.makeGetRequest<UserDTO>(`${basePath}user/profile`);
  }

  // --- MÉTODOS DE SISTEMA (/system) ---

  async getVersion(): Promise<VersionDTO> {
    const basePath = await this.getPath();
    // Coincide con el nuevo SystemController del backend
    return this.makeGetRequest<VersionDTO>(`${basePath}system/version`);
  }

  // --- UTILIDADES ---

  async cleanAllData(): Promise<boolean> {
    this.path = null;
    return await this.persistence.resetValues();
  }
}