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

          return existingRow;
        } else {
          // Si es un proyecto completamente nuevo en la semana, usamos el constructor limpio con ceros
          return new ProjectTimeRowDTO(project.id, project.name);
        }
      });

      // IMPORTANTE: Asignamos el objeto siempre para quitar el spinner
      this.timeSheet = finalTS;
      this.currentWeekId = weekId;

    } catch (error) {
      console.error('[TS] Error crítico al cargar semana:', error);
      // Incluso en error crítico, inicializamos algo para no dejar el loading infinito
      this.timeSheet = new TimeSheetDTO(weekId);
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

  public async refreshCurrentWeek() {
    console.log('[TS] Forzando recarga de proyectos y horas...');
    await this.loadCurrentWeek(this.currentWeekId);
  }

  ngOnDestroy() {
    this.weekSubscription?.unsubscribe();
  }
}