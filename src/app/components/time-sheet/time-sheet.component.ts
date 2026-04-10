import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-time-sheet',
  templateUrl: './time-sheet.component.html',
  styleUrls: ['./time-sheet.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class TimeSheetComponent {
  // Datos de ejemplo (Luego los conectarás con tu servicio)
  public projects = [
    { name: 'Web App Pro', mon: 8, tue: 8, wed: 4, thu: 6, fri: 8, sat: 0, sun: 0 },
    { name: 'API Rest Dev', mon: 0, tue: 0, wed: 4, thu: 2, fri: 4, sat: 0, sun: 0 },
    { name: 'Spring Security project', mon: 2, tue: 0, wed: 4, thu: 2, fri: 3, sat: 0, sun: 0 },
    { name: 'Capacitor migration', mon: 0, tue: 1, wed: 4, thu: 2, fri: 8, sat: 0, sun: 0 },
    { name: 'PetClinic project', mon: 6, tue: 0, wed: 4, thu: 2, fri: 7, sat: 0, sun: 0 },
    { name: 'Vitaalea', mon: 1, tue: 4, wed: 4, thu: 2, fri: 6, sat: 0, sun: 0 },
    { name: 'Rollback services', mon: 2, tue: 2, wed: 4, thu: 2, fri: 5, sat: 0, sun: 0 }
  ];

  public weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  calculateTotal(p: any): number {
    return p.mon + p.tue + p.wed + p.thu + p.fri + p.sat + p.sun;
  }
}