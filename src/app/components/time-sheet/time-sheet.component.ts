import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectTimeRowDTO, TimeEntryDTO, TimeSheetDTO } from 'src/app/models/timeSheetDTO.model';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserDTO } from 'src/app/models/userDTO.model';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class TimeSheetComponent implements OnInit {
  private readonly utils = inject(UtilsService);
  private readonly dataMgmt = inject(DataManagementService);
  public user: UserDTO | null = null;
  public currentWeekId: string = '2026-W15';
  public timeSheet: TimeSheetDTO | null = null;
  public weekDays: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  public globalComment: string | null = '';


  async ngOnInit() {
    // 1. Recuperar usuario logueado
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');

    if (this.user) {
      await this.loadCurrentWeek();
    }
  }

  async loadCurrentWeek() {
    if (!this.user) return;

    try {
      // 1. Cargamos proyectos REALES filtrados por el BACKEND para esta semana
      const realProjects = await this.dataMgmt.getProjects(this.user.id, this.currentWeekId);

      // 2. Creamos el nuevo objeto TimeSheet
      const newTimeSheet = new TimeSheetDTO(this.currentWeekId);

      // 3. Mapeamos solo los proyectos que el Backend nos dijo que están vigentes
      newTimeSheet.rows = realProjects.map(proj => {
        return new ProjectTimeRowDTO(proj.id.toString(), proj.name);
      });

      this.timeSheet = newTimeSheet;
      console.log('[TS] Proyectos vigentes cargados:', this.timeSheet.rows.length);
    } catch (error) {
      console.error('[TS] Error al sincronizar con el Backend:', error);
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
}