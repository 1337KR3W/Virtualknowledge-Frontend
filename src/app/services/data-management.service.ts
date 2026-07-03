import { inject, Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { PersistenceService } from './persistence.service';
import { UserResponseDTO } from '../models/userDTO.model';
import { VersionDTO } from '../models/versionDTO.model';
import { BehaviorSubject } from 'rxjs';
import { TimeSheetResponseDTO } from '../models/timeSheetDTO.model';
import { DepartmentRequestDTO, DepartmentResponseDTO } from '../models/departmentDTO.model';
import { ProjectRequestDTO, ProjectResponseDTO } from '../models/projectDTO.model';

@Injectable({ providedIn: 'root' })
export class DataManagementService {
  private readonly rest = inject(RestService);
  private readonly persistence = inject(PersistenceService);
  public showBackButton = new BehaviorSubject<boolean>(false);
  public isAdmin$ = new BehaviorSubject<boolean>(false);

  async login(email: string, password: string): Promise<[UserResponseDTO, VersionDTO]> {
    const authResponse = await this.rest.login(email, password);
    console.log('[DEBUG] AuthResponse recibido:', authResponse);

    if (!authResponse?.token) { throw new Error('LOGIN_ERROR: No token received'); }
    if (!authResponse.id) {
      console.error('[ERROR] El backend no envió el id, recibido:', authResponse);
      throw new Error('LOGIN_ERROR: id missing');
    }

    await this.persistence.setValue('token', authResponse.token);

    const role = String(authResponse.role || '');
    const isAdmin = role.includes('ROLE_ADMIN');

    console.log('[DEBUG] Rol detectado para isAdmin:', role);
    console.log('[DEBUG] ¿Resultado es Admin?:', isAdmin);

    this.isAdmin$.next(isAdmin);
    await this.persistence.setValue('isAdmin', isAdmin);

    const [userLogged, version] = await Promise.all([
      this.loadUserLogged(authResponse.id),
      this.loadProxyVersion()
    ]);

    return [userLogged, version];
  }

  async createNewUser(userData: any): Promise<void> {
    try {
      const isAdmin = await this.persistence.getValue('isAdmin');
      const token = await this.persistence.getValue('token');

      console.log('[DEBUG] ¿Soy Admin según storage?:', isAdmin);
      console.log('[DEBUG] Token que se va a enviar:', token?.substring(0, 20) + '...');
      await this.rest.registerUser(userData);
    } catch (error) {
      console.error('[DM] Error creating user:', error);
      throw error;
    }
  }

  async checkAdminStatus(): Promise<void> {
    const isAdmin = await this.persistence.getValue('isAdmin');
    console.log('[DEBUG] Valor recuperado de persistencia:', isAdmin);
    this.isAdmin$.next(!!isAdmin);
  }

  async loadUserLogged(userId: number): Promise<UserResponseDTO> {
    const user = await this.rest.getUserProfile(userId);
    console.log('[DM] Usuario cargado con roles:', user.roleName);
    await this.persistence.setValue('userLogged', user);
    return user;
  }

  async loadProxyVersion(): Promise<VersionDTO> {
    const version = await this.rest.getVersion();
    await this.persistence.setValue('lastSync', new Date().toISOString());
    return version;
  }

  /**
 * Envía el TimeSheet al backend y actualiza la caché local
 */
  async saveTimeSheet(timeSheet: TimeSheetResponseDTO): Promise<void> {
    try {
      const user = await this.getValueFromStorage<UserResponseDTO>('userLogged');
      if (!user) throw new Error('No user logged in');

      console.log('[DM] Guardando TimeSheet para la semana:', timeSheet.weekId);

      await this.rest.saveTimeSheet(timeSheet, user.id);

      await this.persistence.setValue(`timesheet_${timeSheet.weekId}`, timeSheet);

    } catch (error) {
      console.error('[DM.saveTimeSheet] Error al guardar:', error);
      throw error;
    }
  }

  private createEmptyTimeSheet(weekId: string): TimeSheetResponseDTO {
    return {
      weekId: weekId,
      globalComment: '',
      rows: [],
      updatedAt: new Date().toISOString()
    };
  }

  async getTimeSheet(weekId: string): Promise<TimeSheetResponseDTO> {
    if (!weekId || weekId.trim() === '' || !weekId.includes('-W')) {
      console.warn('[DM] Intento de carga con ID inválido, abortando:', weekId);
      return this.createEmptyTimeSheet(weekId || 'N/A');
    }

    const user = await this.getValueFromStorage<UserResponseDTO>('userLogged');
    if (!user) throw new Error('No user logged');

    try {
      const data = await this.rest.getTimeSheetByWeek(weekId, user.id);
      return data || this.createEmptyTimeSheet(weekId);
    } catch (error) {
      console.warn('[DM] No se pudo recuperar del servidor, buscando en local...', error);
      const localData = await this.getValueFromStorage<TimeSheetResponseDTO>(`timesheet_${weekId}`);
      return localData || this.createEmptyTimeSheet(weekId);
    }
  }

  async logout(): Promise<void> {
    this.isAdmin$.next(false)
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

  async getAllUsers(): Promise<UserResponseDTO[]> {
    try {

      return await this.rest.getAllUsers();
    } catch (error) {
      console.error('[DM.getAllUsers] Error al obtener usuarios:', error);
      return [];
    }
  }

  /**
   * Recupera proyectos de forma segura.
   * Ya no necesita userId porque el Backend lo extrae del JWT.
   * @param weekId (Opcional) Si se envía, filtra por vigencia. Si no, trae todos.
   */
  async getProjects(weekId?: string): Promise<ProjectResponseDTO[]> {
    try {
      if (weekId && weekId.trim() !== '') {
        console.log(`[DM] Cargando proyectos filtrados para la semana: ${weekId}`);
        return await this.rest.getProjectsByUserIdAndWeek(weekId);
      } else {

        console.log(`[DM] Cargando listado histórico de proyectos`);
        return await this.rest.getProjectsByUserId();
      }
    } catch (error) {
      console.error('[DM.getProjects] Error al recuperar proyectos:', error);
      throw error;
    }
  }

  async getProjectById(id: number): Promise<ProjectRequestDTO> {
    try {
      console.log(`[DM] Solicitando proyecto con ID: ${id}`);
      return await this.rest.getProjectById(id);
    } catch (error) {
      console.error(`[DM.getProjectById] Error al recuperar el proyecto ${id}:`, error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<UserResponseDTO> {
    try {
      console.log(`[DM] Solicitando usuario con ID: ${id}`);
      return await this.rest.getUserById(id);
    } catch (error) {
      console.error(`[DM.getUserById] Error al recuperar el usuario ${id}:`, error);
      throw error;
    }
  }

  setBackButton(value: boolean) {
    this.showBackButton.next(value);
  }

  async getDepartments(): Promise<DepartmentResponseDTO[]> {
    try {
      return await this.rest.getDepartments();
    } catch (error) {
      console.error('[DM.getDepartments] Error al traer departamentos:', error);
      throw error;
    }
  }

  async createDepartment(department: DepartmentRequestDTO): Promise<void> {
    try {
      // Asumiendo que tu RestService.createDepartment también recibe el objeto
      await this.rest.createDepartment(department);
    } catch (error) {
      console.error('[DM.createDepartment] Error:', error);
      throw error;
    }
  }

  async getUsersByDepartment(departmentId: number): Promise<UserResponseDTO[]> {
    try {
      return await this.rest.getUsersByDepartment(departmentId);
    } catch (error) {
      console.error('[DM.getUsersByDepartment] Error al recuperar usuarios:', error);
      throw error;
    }
  }


  async updateDepartment(id: number, departmentData: { name: string, userIds: number[] }): Promise<void> {
    try {

      await this.rest.updateDepartment(id, departmentData);
    } catch (error) {
      console.error(`[DM.updateDepartment] Error:`, error);
      throw error;
    }
  }

  async deleteDepartment(id: number): Promise<void> {
    try {
      await this.rest.deleteDepartment(id);
    } catch (error) {
      console.error(`[DM.deleteDepartment] Error al borrar departamento ${id}:`, error);
      throw error;
    }
  }

  async createProject(project: ProjectRequestDTO): Promise<void> {
    try {
      await this.rest.createProject(project);
    } catch (error) {
      console.error('[DM.createProject] Error al crear proyecto:', error);
      throw error;
    }
  }
  async getAllProjectsAdmin(): Promise<ProjectResponseDTO[]> {
    try {
      return await this.rest.getAllProjectsAdmin();
    } catch (error) {
      console.error('[DM.getAllProjectsAdmin] Error:', error);
      throw error;
    }
  }

  async updateProject(id: number, project: ProjectRequestDTO): Promise<void> {
    try {
      await this.rest.updateProject(id, project);
    } catch (error) {
      console.error(`[DM.updateProject] Error al editar proyecto ${id}:`, error);
      throw error;
    }
  }

  async updateUser(id: number, userData: any): Promise<void> {
    try {
      await this.rest.updateUser(id, userData);
    } catch (error) {
      console.error(`[DM.updateUser] Error al editar usuario ${id}:`, error);
      throw error;
    }
  }

  async deleteProject(id: number): Promise<void> {
    try {
      await this.rest.deleteProject(id);
    } catch (error) {
      console.error(`[DM.deleteProject] Error al borrar proyecto ${id}:`, error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.rest.deleteUser(id);
    } catch (error) {
      console.error(`[DM.deleteUser] Error al borrar usuario ${id}:`, error);
      throw error;
    }
  }

  async downloadWeeklyTimesheetPdf(weekId: string): Promise<Blob> {
    try {
      console.log('[DM] Solicitando generación de informe semanal en PDF:', weekId);
      return await this.rest.getWeeklyTimesheetPdf(weekId);
    } catch (error) {
      console.error('[DM.downloadWeeklyTimesheetPdf] Error al procesar el documento:', error);
      throw error;
    }
  }
  async getDepartmentById(id: number): Promise<DepartmentResponseDTO> {
    return await this.rest.getDepartmentById(id);
  }





}