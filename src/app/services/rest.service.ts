import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';
import { AbstractService } from './abstract.service';
import { VersionDTO } from '../models/versionDTO.model';
import { ProjectRequestDTO, ProjectResponseDTO } from '../models/projectDTO.model';
import { DepartmentRequestDTO, DepartmentResponseDTO } from '../models/departmentDTO.model';
import { AuthResponse } from '../models/auth.model';
import { UserResponseDTO } from '../models/userDTO.model';
import { TimeSheetResponseDTO } from '../models/timeSheetDTO.model';
import { firstValueFrom } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


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

  async login(email: string, password: string): Promise<AuthResponse> {
    const basePath = await this.getPath();
    return this.makePostRequestWithoutHeaders(`${basePath}auth/login`, {
      email,
      password
    });
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const basePath = await this.getPath();
    return this.makeGetRequest<UserResponseDTO[]>(`${basePath}users/admin/all`);
  }

  async getAllUsersWithoutDepartment(): Promise<UserResponseDTO[]> {
    const basePath = await this.getPath();
    return this.makeGetRequest<UserResponseDTO[]>(`${basePath}users/admin/no-department`);
  }

  async getUserProfile(id: number): Promise<UserResponseDTO> { //
    const basePath = await this.getPath();
    return this.makeGetRequest<UserResponseDTO>(`${basePath}users/${id}`);
  }

  async getVersion(): Promise<VersionDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<VersionDTO>(`${basePath}system/version`);
  }

  async getProjectsByUserId(): Promise<ProjectResponseDTO[]> {
    const basePath = await this.getPath();
    const url = `${basePath}projects/my-projects`;
    return this.makeGetRequest<ProjectResponseDTO[]>(url);
  }

  async getMyDepartment(): Promise<DepartmentResponseDTO> {
    const basePath = await this.getPath();
    const url = `${basePath}departments/my-department`;
    return this.makeGetRequest<DepartmentResponseDTO>(url);
  }

  async getProjectsByUserIdAndWeek(weekId: string): Promise<ProjectResponseDTO[]> {
    const basePath = await this.getPath();
    const url = `${basePath}projects/my-projects/week/${weekId}`;
    return this.makeGetRequest<ProjectResponseDTO[]>(url);
  }

  async getProjectById(id: number): Promise<ProjectRequestDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<ProjectRequestDTO>(`${basePath}projects/${id}`);
  }

  async getUserById(id: number): Promise<UserResponseDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<UserResponseDTO>(`${basePath}users/${id}`);
  }

  async saveTimeSheet(timeSheet: TimeSheetResponseDTO, userId: number): Promise<void> {
    const basePath = await this.getPath();
    const payload = {
      weekId: timeSheet.weekId,
      globalComment: timeSheet.globalComment,
      rows: timeSheet.rows,
      userId: userId
    };

    return this.makePostRequest(`${basePath}timesheet/save`, payload);
  }

  async getTimeSheetByWeek(weekId: string, userId: number): Promise<TimeSheetResponseDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<TimeSheetResponseDTO>(`${basePath}timesheet/my-timesheet/${weekId}`);
  }

  async registerUser(userData: any): Promise<any> {
    const basePath = await this.getPath();
    return this.makePostRequest(`${basePath}users/admin/register`, userData);
  }

  async cleanAllData(): Promise<boolean> {
    this.path = null;
    return await this.persistence.resetValues();
  }

  async getDepartments(): Promise<DepartmentResponseDTO[]> {
    const basePath = await this.getPath();
    return this.makeGetRequest<DepartmentResponseDTO[]>(`${basePath}departments`);
  }

  async createDepartment(department: DepartmentRequestDTO): Promise<void> {
    const basePath = await this.getPath();
    await this.makePostRequest(`${basePath}departments`, department);
  }

  async getDepartmentById(id: number): Promise<DepartmentResponseDTO> {
    const basePath = await this.getPath();
    return this.makeGetRequest<DepartmentResponseDTO>(`${basePath}departments/${id}`);
  }

  async getUsersByDepartment(departmentId: number): Promise<UserResponseDTO[]> {
    if (departmentId === null || departmentId === undefined || isNaN(departmentId)) {
      console.warn('[REST] Intento de llamada con ID inválido, retornando lista vacía');
      return [];
    }
    const basePath = await this.getPath();
    return this.makeGetRequest<UserResponseDTO[]>(`${basePath}users/admin/department/${departmentId}`);
  }

  async updateDepartment(id: number, departmentData: any): Promise<void> {
    const basePath = await this.getPath();
    const finalUrl = `${basePath}departments/${id}`;
    await this.makePutRequest(finalUrl, departmentData);
  }

  async deleteDepartment(id: number): Promise<void> {
    const basePath = await this.getPath();
    await this.makeDeleteRequest(`${basePath}departments/${id}`);
  }

  async createProject(project: ProjectRequestDTO): Promise<void> {
    const basePath = await this.getPath();
    await this.makePostRequest(`${basePath}projects/admin/create`, project);
  }

  async getWeeklyTimesheetPdf(weekId: string): Promise<Blob> {
    const basePath = await this.getPath();
    const url = `${basePath}pdf/timesheet/${weekId}`;
    return this.makeGetBlobRequest(url);
  }

  async getAllProjectsAdmin(): Promise<ProjectResponseDTO[]> {
    const basePath = await this.getPath();
    return this.makeGetRequest<ProjectResponseDTO[]>(`${basePath}projects/admin/all`);
  }

  async updateProject(id: number, project: ProjectRequestDTO): Promise<void> {
    const basePath = await this.getPath();
    await this.makePutRequest(`${basePath}projects/admin/edit/${id}`, project);
  }

  async updateUser(id: number, userData: any): Promise<void> {
    const basePath = await this.getPath();
    await this.makePutRequest(`${basePath}users/admin/edit/${id}`, userData);
  }

  async deleteProject(id: number): Promise<void> {
    const basePath = await this.getPath();
    await this.makeDeleteRequest(`${basePath}projects/admin/delete/${id}`);
  }

  async deleteUser(id: number): Promise<void> {
    const basePath = await this.getPath();
    await this.makeDeleteRequest(`${basePath}users/admin/delete/${id}`);
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const basePath = await this.getPath();

    return this.makePostRequest<AuthResponse>(`${basePath}auth/refresh`, {}, refreshToken);
  }
}