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
import { Subscription } from 'rxjs';
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

      const diasSemanales = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      let activeProjects: ProjectDTO[] = await this.dataMgmt.getProjects(weekId) || [];
      const savedData = await this.dataMgmt.getTimeSheet(weekId);

      this.globalComment = savedData?.globalComment || '';
      finalTS.globalComment = this.globalComment;

      finalTS.rows = activeProjects.map(project => {
        const existingRow = savedData?.rows?.find(r => Number(r.pid) === project.id);

        let rowToUse: ProjectTimeRowDTO;

        if (existingRow) {
          rowToUse = existingRow;
          if (!rowToUse.days) rowToUse.days = {};
        } else {
          rowToUse = new ProjectTimeRowDTO(project.id, project.name);
        }

        diasSemanales.forEach(dia => {
          if (!rowToUse.days[dia]) {
            rowToUse.days[dia] = new TimeEntryDTO(0, '');
          }
        });

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
      const parts = weekId.split('-W');
      const year = parseInt(parts[0], 10);
      const week = parseInt(parts[1], 10);

      const firstDayOfYear = new Date(year, 0, 1);
      const daysOffset = (week - 1) * 7;

      const isoMonday = new Date(year, 0, 1 + daysOffset);
      const dayOfWeek = isoMonday.getDay();
      const dayDiff = isoMonday.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const mondayDate = new Date(isoMonday.setDate(dayDiff));

      const currentDay = new Date(mondayDate);
      currentDay.setDate(mondayDate.getDate() - 1);

      this.weekDates = [];
      for (let i = 0; i < 7; i++) {
        const y = currentDay.getFullYear();
        const m = String(currentDay.getMonth() + 1).padStart(2, '0');
        const d = String(currentDay.getDate()).padStart(2, '0');

        this.weekDates.push(`${y}/${m}/${d}`);
        currentDay.setDate(currentDay.getDate() + 1);
      }
    } catch (err) {
      console.error('[TS] Error parseando fechas de la semana, usando fallback.', err);

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

    return Object.values(row.days).reduce((sum, entry) => {

      const horas = Number(entry.hours) || 0;
      return sum + horas;
    }, 0);
  }

  ngOnDestroy() {
    this.weekSubscription?.unsubscribe();
  }
}