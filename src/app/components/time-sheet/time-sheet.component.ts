import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectTimeRowDTO, TimeEntryDTO, TimeSheetDTO } from 'src/app/models/timeSheetDTO.model';
import { UtilsService } from 'src/app/services/utils.service';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class TimeSheetComponent implements OnInit {
  private readonly utils = inject(UtilsService);

  public timeSheet: TimeSheetDTO;
  public weekDays: string[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  constructor() {
    this.timeSheet = new TimeSheetDTO('2026-W15');
  }

  ngOnInit(): void {
    this.loadMockData();
  }

  private loadMockData() {
    // Ejemplo de cómo añadirías filas usando las clases
    const row1 = new ProjectTimeRowDTO('P-101', 'Web App Pro');
    row1.days.mon.hours = 8;
    row1.days.mon.comment = 'Fixing CORS issues';

    const row2 = new ProjectTimeRowDTO('P-202', 'API Rest Dev');
    row2.days.wed.hours = 4;

    this.timeSheet.rows.push(row1, row2);
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

  saveTimeSheet() {

    console.log('Objeto listo para el Backend:', this.timeSheet);
  }
}