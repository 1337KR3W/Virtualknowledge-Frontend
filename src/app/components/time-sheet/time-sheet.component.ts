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

    // 2. Intentar cargar datos guardados del servidor para esta semana
    // (Este método aún lo tenemos que pulir, por ahora creamos uno nuevo)
    const newTimeSheet = new TimeSheetDTO(this.currentWeekId);

    // 3. CARGA DE PROYECTOS REALES
    try {
      const realProjects = await this.dataMgmt.getProjects(this.user.id);

      // Mapeamos los proyectos a las filas del TimeSheet
      newTimeSheet.rows = realProjects.map(proj => {
        // proj.id viene del backend y es lo que necesitamos en el 'pid'
        return new ProjectTimeRowDTO(proj.id.toString(), proj.name);
      });

      this.timeSheet = newTimeSheet;
      console.log('[TS] Proyectos cargados:', this.timeSheet.rows);
    } catch (error) {
      console.error('[TS] Error cargando proyectos:', error);
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