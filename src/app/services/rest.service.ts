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

  private async getPath(): Promise<string> {
    if (this.path !== null) return this.path;
    const customer = await this.persistence.getValue('customer');
    let baseUrl = environment.urlPrefix || '';
    if (customer && baseUrl.includes('$CUSTOMER$')) {
      baseUrl = baseUrl.replace('$CUSTOMER$', customer);
    }
    let finalUrl = baseUrl + environment.apiUrl;
    this.path = finalUrl.replace(/([^:]\/)\/+/g, "$1");
    return this.path;
  }

  async login(email: string, password: string): Promise<any> {
    const basePath = await this.getPath();
    return this.makePostRequestWithoutHeaders(`${basePath}auth/login`, {
      email,
      password
    });
  }

  async getUserProfile(id: number): Promise<UserDTO> { //
    const basePath = await this.getPath();
    return this.makeGetRequest<UserDTO>(`${basePath}user/profile/${id}`);
  }

  async getVersion(): Promise<VersionDTO> {
    const basePath = await this.getPath();
    // Coincide con el nuevo SystemController del backend
    return this.makeGetRequest<VersionDTO>(`${basePath}system/version`);
  }

  async getProjectsByUserId(): Promise<ProjectDTO[]> {
    const basePath = await this.getPath();
    const url = `${basePath}projects/my-projects`;
    console.log('[REST] Obteniendo listado histórico personal:', url);
    return this.makeGetRequest<ProjectDTO[]>(url);
  }

  async getProjectsByUserIdAndWeek(weekId: string): Promise<ProjectDTO[]> {
    const basePath = await this.getPath();
    const url = `${basePath}projects/my-projects/week/${weekId}`;
    console.log('[REST] Obteniendo proyectos vigentes para la semana:', weekId);
    return this.makeGetRequest<ProjectDTO[]>(url);
  }

  async saveTimeSheet(timeSheet: TimeSheetDTO, userId: number): Promise<void> {
    const basePath = await this.getPath();
    const payload = {
      weekId: timeSheet.weekId,
      globalComment: timeSheet.globalComment,
      rows: timeSheet.rows,
      userId: userId
    };

    return this.makePostRequest(`${basePath}timesheet/save`, payload);
  }

  async getTimeSheetByWeek(weekId: string, userId: number): Promise<TimeSheetDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<TimeSheetDTO>(`${basePath}timesheet/my-timesheet/${weekId}`);
  }

  async registerUser(userData: any): Promise<any> {
    const basePath = await this.getPath();
    return this.makePostRequest(`${basePath}user/admin/register`, userData);
  }

  async cleanAllData(): Promise<boolean> {
    this.path = null;
    return await this.persistence.resetValues();
  }

  async getDepartments(): Promise<any[]> {
    const basePath = await this.getPath();
    return this.makeGetRequest<any[]>(`${basePath}departments`);
  }

  async createDepartment(departmentData: any): Promise<any> {
    const basePath = await this.getPath();
    return this.makePostRequest(`${basePath}departments`, departmentData);
  }

  async getUsersByDepartment(departmentId: number): Promise<UserDTO[]> {
    const basePath = await this.getPath();
    return this.makeGetRequest<UserDTO[]>(`${basePath}user/admin/department/${departmentId}`);
  }

  async createProject(projectData: any): Promise<any> {
    const basePath = await this.getPath();
    return this.makePostRequest(`${basePath}projects/admin/create`, projectData);
  }
}