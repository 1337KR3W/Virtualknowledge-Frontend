import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectTimeRowDTO, TimeEntryDTO, TimeSheetDTO } from 'src/app/models/timeSheetDTO.model';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserDTO } from 'src/app/models/userDTO.model';
import { TimeStateService } from 'src/app/services/time-state';
import { Subscription, switchMap } from 'rxjs';
import { ProjectDTO } from 'src/app/models/projectDTO.model';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class TimeSheetComponent implements OnInit, OnDestroy {
  private readonly utils = inject(UtilsService);
  private readonly dataMgmt = inject(DataManagementService);
  public readonly timeState = inject(TimeStateService);

  public user: UserDTO | null = null;
  public currentWeekId: string = '2026-W15';
  public timeSheet: TimeSheetDTO | null = null;
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public weekDates: string[] = [];
  public globalComment: string | null = '';
  private weekSubscription?: Subscription;
  public isDownloadingPdf: boolean = false;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');

    if (this.user) {
      // Usamos switchMap para cancelar peticiones previas si cambia la semana rápido
      this.weekSubscription = this.timeState.weekId$.pipe(
        switchMap(async (newWeekId) => {
          console.log('[TS] Nueva semana procesando:', newWeekId);
          await this.loadCurrentWeek(newWeekId);
          return newWeekId;
        })
      ).subscribe();
    }
  }

  async loadCurrentWeek(weekId: string) {
    try {
      this.calculateWeekDates(weekId);
      // Inicializamos un objeto limpio por defecto
      const finalTS = new TimeSheetDTO(weekId);

      // Obtenemos proyectos (si falla o no hay, devolvemos array vacío)
      let activeProjects: ProjectDTO[] = [];
      try {
        activeProjects = await this.dataMgmt.getProjects(weekId) || [];
      } catch (e) {
        console.warn('[TS] El usuario no tiene proyectos activos aún.', e);
        activeProjects = [];
      }

      const savedData = await this.dataMgmt.getTimeSheet(weekId);
      console.log('--- DEPURACIÓN FRONTEND ---');
      console.log('Datos recibidos:', savedData);
      console.log('Filas recibidas:', savedData?.rows);
      console.log('Comentario recibido:', savedData?.globalComment);

      // 🛠️ CORRECCIÓN 1: Extraemos y asignamos el comentario global recuperado de la Base de Datos
      this.globalComment = savedData?.globalComment || '';
      finalTS.globalComment = this.globalComment; // Lo acoplamos también al DTO general si tu modelo lo requiere

      // Mapeamos filas solo si hay proyectos
      finalTS.rows = activeProjects.map(project => {
        const existingRow = savedData?.rows?.find(r => Number(r.pid) === project.id);

        if (existingRow) {
          // Si el proyecto existe en la BD, nos aseguramos de rellenar los días que Java no envió
          const diasSemanales = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

          if (!existingRow.days) {
            existingRow.days = {};
          }

          diasSemanales.forEach(dia => {
            if (!existingRow.days[dia]) {
              // Si Java no devolvió este día, le metemos un 0 por defecto para que no falle el HTML
              existingRow.days[dia] = new TimeEntryDTO(0, '');
            }
          });

          (existingRow as any).departmentName = (project as any).departmentName || (project as any).department || 'General';

          return existingRow;
        } else {
          const newRow = new ProjectTimeRowDTO(project.id, project.name);
          (newRow as any).departmentName = (project as any).departmentName || (project as any).department || 'General';
          // Si es un proyecto completamente nuevo en la semana, usamos el constructor limpio con ceros
          return newRow;
        }
      });

      // IMPORTANTE: Asignamos el objeto siempre para quitar el spinner
      this.timeSheet = finalTS;
      this.currentWeekId = weekId;

    } catch (error) {
      console.error('[TS] Error crítico al cargar semana:', error);
      this.globalComment = ''; // Limpiamos en caso de error sutil
      // Incluso en error crítico, inicializamos algo para no dejar el loading infinito
      this.timeSheet = new TimeSheetDTO(weekId);
    }
  }

  private calculateWeekDates(weekId: string) {
    try {
      // Extraemos año y número de semana de cadenas tipo "2026-W27"
      const parts = weekId.split('-W');
      const year = parseInt(parts[0], 10);
      const week = parseInt(parts[1], 10);

      // Calculamos el primer día del año
      const firstDayOfYear = new Date(year, 0, 1);
      const daysOffset = (week - 1) * 7;

      // Obtenemos el lunes de esa semana según el estándar ISO
      const isoMonday = new Date(year, 0, 1 + daysOffset);
      const dayOfWeek = isoMonday.getDay();
      const dayDiff = isoMonday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const mondayDate = new Date(isoMonday.setDate(dayDiff));

      // Como tu tabla empieza en Domingo (SUN), restamos 1 día al lunes base
      const currentDay = new Date(mondayDate);
      currentDay.setDate(mondayDate.getDate() - 1);

      this.weekDates = [];
      // Rellenamos el array recorriendo de Domingo a Sábado (7 iteraciones)
      for (let i = 0; i < 7; i++) {
        const y = currentDay.getFullYear();
        const m = String(currentDay.getMonth() + 1).padStart(2, '0');
        const d = String(currentDay.getDate()).padStart(2, '0');

        this.weekDates.push(`${y}/${m}/${d}`);
        currentDay.setDate(currentDay.getDate() + 1); // Avanzar un día
      }
    } catch (err) {
      console.error('[TS] Error parseando fechas de la semana, usando fallback.', err);
      // Fallback seguro en caso de formato no válido para que la app no explote
      this.weekDates = Array(7).fill('----/--/--');
    }
  }

  async openCommentModal(dayEntry: TimeEntryDTO) {
    const updatedComment = await this.utils.openModal(
      CommentModalComponent,
      { comment: dayEntry.comment },
      'small-modal'
    );

    if (updatedComment !== undefined) {
      dayEntry.comment = updatedComment;
      console.log('Comentario actualizado con éxito');
    }
  }

  async saveTimeSheet() {
    if (!this.timeSheet) return;

    try {
      this.timeSheet.globalComment = this.globalComment || "";

      await this.dataMgmt.saveTimeSheet(this.timeSheet);
      console.log('Semana guardada con éxito');
    } catch (error) {
      console.error('Error en el guardado:', error);
    }
  }

  public async refreshCurrentWeek() {
    console.log('[TS] Forzando recarga de proyectos y horas...');
    await this.loadCurrentWeek(this.currentWeekId);
  }

  async downloadWeeklyPdf() {
    if (!this.timeSheet || this.isDownloadingPdf) return;

    try {
      this.isDownloadingPdf = true;
      console.log('[TS] Descargando reporte en PDF para la semana activa:', this.currentWeekId);

      // El backend recibe el ID y genera el PDF buscando los datos persistidos
      const blob: Blob = await this.dataMgmt.downloadWeeklyTimesheetPdf(this.currentWeekId);

      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `timesheet_${this.currentWeekId}.pdf`;

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      window.URL.revokeObjectURL(blobUrl);
      console.log('[TS] Archivo PDF procesado por el cliente con éxito.');
    } catch (error) {
      console.error('[TS] Error al procesar la exportación del PDF:', error);
    } finally {
      this.isDownloadingPdf = false;
    }
  }

  ngOnDestroy() {
    this.weekSubscription?.unsubscribe();
  }
}