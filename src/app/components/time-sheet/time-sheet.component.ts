import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { DataManagementService } from 'src/app/services/data-management.service';
import { TimeStateService } from 'src/app/services/time-state';
import { Subscription } from 'rxjs';
import { UserResponseDTO } from 'src/app/models/userDTO.model';
import { ProjectTimeRowDTO, TimeEntryDTO, TimeSheetResponseDTO } from 'src/app/models/timeSheetDTO.model';
import { ProjectResponseDTO } from 'src/app/models/projectDTO.model';


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

  public user: UserResponseDTO | null = null;
  public currentWeekId: string = '';
  public timeSheet: TimeSheetResponseDTO | null = null;
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public weekDates: string[] = [];
  public globalComment: string | null = '';
  private weekSubscription?: Subscription;
  public isDownloadingPdf: boolean = false;

  private createEmptyEntry(): TimeEntryDTO { return { hours: 0, comment: '' }; }

  private createEmptyRow(pid: number, projectName: string, departmentName: string): ProjectTimeRowDTO {
    return {
      pid,
      projectName,
      departmentName,
      days: {
        sun: this.createEmptyEntry(), mon: this.createEmptyEntry(), tue: this.createEmptyEntry(),
        wed: this.createEmptyEntry(), thu: this.createEmptyEntry(), fri: this.createEmptyEntry(), sat: this.createEmptyEntry()
      }
    };
  }

  private createEmptyTimeSheet(weekId: string): TimeSheetResponseDTO {
    return { weekId, globalComment: '', rows: [], updatedAt: new Date().toISOString() };
  }

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserResponseDTO>('userLogged');

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
      const diasSemanales = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

      const activeProjects: ProjectResponseDTO[] = await this.dataMgmt.getProjects(weekId) || [];
      const savedData = await this.dataMgmt.getTimeSheet(weekId);

      const rows: ProjectTimeRowDTO[] = activeProjects.map(project => {
        const existingRow = savedData?.rows?.find(r => Number(r.pid) === project.id);
        let rowToUse = existingRow ? { ...existingRow } : this.createEmptyRow(project.id, project.name, project.departmentName || '');

        diasSemanales.forEach(dia => {
          if (!rowToUse.days[dia]) rowToUse.days[dia] = this.createEmptyEntry();
        });
        return rowToUse;
      });

      this.timeSheet = {
        weekId,
        globalComment: savedData?.globalComment || '',
        rows: rows,
        updatedAt: new Date().toISOString()
      };
      this.globalComment = this.timeSheet.globalComment;
      this.currentWeekId = weekId;
    } catch (error) {
      console.error('[TS] Error loading week:', error);
      this.timeSheet = this.createEmptyTimeSheet(weekId);
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
      console.error('[TS] Error parsing week dates, using fallback.', err);

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
    }
  }

  async saveTimeSheet() {
    if (!this.timeSheet) return;
    try {
      this.timeSheet.globalComment = this.globalComment;
      await this.dataMgmt.saveTimeSheet(this.timeSheet);
      this.utils.showToast('Week saved successfully', 'success');
    } catch (error) {
      console.error('Error in saving week:', error);
    }
  }

  public async refreshCurrentWeek() {
    await this.loadCurrentWeek(this.currentWeekId);
  }

  async downloadWeeklyPdf() {
    if (!this.timeSheet || this.isDownloadingPdf) return;

    try {
      this.isDownloadingPdf = true;
      const blob: Blob = await this.dataMgmt.downloadWeeklyTimesheetPdf(this.currentWeekId);
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `timesheet_${this.currentWeekId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('[TS] Error processing PDF export:', error);
    } finally {
      this.isDownloadingPdf = false;
    }
  }

  public totalProjectHours(row: ProjectTimeRowDTO): number {
    return Object.values(row.days).reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
  }
  ngOnDestroy() {
    this.weekSubscription?.unsubscribe();
  }
}