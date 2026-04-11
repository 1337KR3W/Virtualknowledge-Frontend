import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProjectTimeRowDTO, TimeEntryDTO, TimeSheetDTO } from 'src/app/models/timeSheetDTO.model';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class TimeSheetComponent implements OnInit {


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
    console.log('Abriendo comentario para la celda:', dayEntry);

    // De momento, podemos usar un prompt simple de JS para probar la funcionalidad
    // hasta que creemos el modal de Ionic real
    const newComment = prompt('Escribe un comentario:', dayEntry.comment);
    if (newComment !== null) {
      dayEntry.comment = newComment;
    }
  }

  saveTimeSheet() {

    console.log('Objeto listo para el Backend:', this.timeSheet);
  }
}