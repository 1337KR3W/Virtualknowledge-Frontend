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
  public globalComment: string | null = '';
  private weekSubscription?: Subscription;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');

    if (this.user) {
      this.weekSubscription = this.timeState.weekId$.subscribe(async (newWeekId) => {
        console.log('[TS] Detectado cambio de semana en el estado:', newWeekId);
        await this.loadCurrentWeek(newWeekId);
      });
    }
  }

  async loadCurrentWeek(weekId: string) {
    try {
      const activeProjects = await this.dataMgmt.getProjects(weekId);
      const savedData = await this.dataMgmt.getTimeSheet(weekId);
      const finalTS = new TimeSheetDTO(weekId);

      finalTS.rows = activeProjects.map(project => {

        const existingRow = savedData?.rows?.find(r => r.pid === project.id.toString());

        if (existingRow) {
          return existingRow;
        } else {
          return new ProjectTimeRowDTO(project.id.toString(), project.name);
        }
      });

      this.timeSheet = finalTS;
      this.currentWeekId = weekId;

    } catch (error) {
      console.error('[TS] Error al cargar semana:', error);
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
      await this.dataMgmt.saveTimeSheet(this.timeSheet);
      console.log('Semana guardada con éxito');
    } catch (error) {
      console.error('Error en el guardado:', error);
    }
  }

  ngOnDestroy() {
    this.weekSubscription?.unsubscribe();
  }
}