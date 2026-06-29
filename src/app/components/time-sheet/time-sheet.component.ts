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
  public currentWeekId: string = '';
  public timeSheet: TimeSheetDTO | null = null;
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public weekDates: string[] = [];
  public globalComment: string | null = '';
  private weekSubscription?: Subscription;
  public isDownloadingPdf: boolean = false;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');

    if (this.user) {
      this.weekSubscription = this.timeState.weekId$.subscribe(async (newWeekId) => {
        // Si la carga actual ya es igual a la nueva, no hacemos nada para evitar duplicados
        if (newWeekId === this.currentWeekId) return;

        this.currentWeekId = newWeekId;
        await this.loadCurrentWeek(newWeekId);
      });
    }
  }

  async loadCurrentWeek(weekId: string) {
    if (!weekId || weekId.length < 5) return;

    try {
      this.calculateWeekDates(weekId);
      const finalTS = new TimeSheetDTO(weekId);

      // Lista de días estándar
      const diasSemanales = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      let activeProjects: ProjectDTO[] = await this.dataMgmt.getProjects(weekId) || [];
      const savedData = await this.dataMgmt.getTimeSheet(weekId);

      this.globalComment = savedData?.globalComment || '';
      finalTS.globalComment = this.globalComment;

      finalTS.rows = activeProjects.map(project => {
        const existingRow = savedData?.rows?.find(r => Number(r.pid) === project.id);

        // Creamos una fila base (ya sea a partir de la existente o una nueva)
        let rowToUse: ProjectTimeRowDTO;

        if (existingRow) {
          rowToUse = existingRow;
          if (!rowToUse.days) rowToUse.days = {};
        } else {
          // CORRECCIÓN AQUÍ: Inicializamos el objeto con un mapa vacío
          rowToUse = new ProjectTimeRowDTO(project.id, project.name);
        }

        // Aseguramos que los 7 días existan SIEMPRE
        diasSemanales.forEach(dia => {
          if (!rowToUse.days[dia]) {
            rowToUse.days[dia] = new TimeEntryDTO(0, '');
          }
        });

        // Asignamos departamento
        (rowToUse as any).departmentName = (project as any).departmentName || (project as any).department || 'General';

        return rowToUse;
      });

      this.timeSheet = finalTS;
      this.currentWeekId = weekId;

    } catch (error) {
      console.error('[TS] Error crítico al cargar semana:', error);
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

  public totalProjectHours(row: ProjectTimeRowDTO): number {
    if (!row.days) return 0;

    // Obtenemos los valores de los días y sumamos
    return Object.values(row.days).reduce((sum, entry) => {
      // Nos aseguramos de tratar el valor como número, por si viene como string
      const horas = Number(entry.hours) || 0;
      return sum + horas;
    }, 0);
  }

  ngOnDestroy() {
    this.weekSubscription?.unsubscribe();
  }
}