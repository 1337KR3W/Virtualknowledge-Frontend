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
  public readonly timeState = inject(TimeStateService); // Inyectamos el estado

  public user: UserDTO | null = null;
  public currentWeekId: string = '2026-W15';
  public timeSheet: TimeSheetDTO | null = null;
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public globalComment: string | null = '';
  private weekSubscription?: Subscription;

  async ngOnInit() {
    // 1. Recuperar usuario logueado
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');

    if (this.user) {
      this.weekSubscription = this.timeState.weekId$.subscribe(async (newWeekId) => {
        console.log('[TS] Detectado cambio de semana en el estado:', newWeekId);
        await this.loadCurrentWeek(newWeekId);
      });
    }
  }

  async loadCurrentWeek(weekId: string) {
    if (!this.user?.id) return;

    try {
      // 1. Pedimos proyectos vigentes para ESTA semana específica
      const filteredProjects = await this.dataMgmt.getProjects(this.user.id, weekId);

      // 2. Cargamos o inicializamos el TimeSheet
      const savedData = await this.dataMgmt.getTimeSheet(weekId);

      if (savedData && savedData.rows?.length > 0) {
        this.timeSheet = savedData;
      } else {
        const newTS = new TimeSheetDTO(weekId);
        newTS.rows = filteredProjects.map(p => new ProjectTimeRowDTO(p.id.toString(), p.name));
        this.timeSheet = newTS;
      }
    } catch (error) {
      console.error('[TS] Error al cargar semana:', error);
    }
  }

  async openCommentModal(dayEntry: TimeEntryDTO) {
    // Abrimos el modal pasando el comentario actual como prop
    const updatedComment = await this.utils.openModal(
      CommentModalComponent,
      { comment: dayEntry.comment },
      'small-modal' // Clase CSS opcional para que no ocupe toda la pantalla en Web
    );

    // Si el usuario guardó algo (updatedComment no es undefined), actualizamos el DTO
    if (updatedComment !== undefined) {
      dayEntry.comment = updatedComment;
      console.log('Comentario actualizado con éxito');
    }
  }

  async saveTimeSheet() {
    if (!this.timeSheet) return;

    try {
      // 1. Mostramos un cargando (opcional)
      //await this.utils.showLoading('Guardando reporte...');

      // 2. Enviamos el objeto al DataManagement
      await this.dataMgmt.saveTimeSheet(this.timeSheet);

      // 3. Notificamos al usuario
      //await this.utils.dismissLoading();
      //this.utils.showToast('Reporte guardado con éxito', 'success');

    } catch (error) {
      //await this.utils.dismissLoading();
      //this.utils.showToast('Error al conectar con el servidor', 'danger');
      console.error('Error en el guardado:', error);
    }
  }

  ngOnDestroy() {
    // Muy importante para evitar fugas de memoria
    this.weekSubscription?.unsubscribe();
  }
}