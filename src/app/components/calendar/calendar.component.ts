import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class CalendarComponent implements OnInit {
  public displayMonth: string = '';
  public displayYear: number = 0;
  public days: (number | null)[] = [];
  public weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  private readonly currentDate: Date = new Date();

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    this.displayYear = year;
    this.displayMonth = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(this.currentDate);

    // Primer día del mes y cuántos días tiene
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 (Dom) a 6 (Sáb)
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Limpiamos y rellenamos el array de días
    this.days = [];

    // Rellenar huecos vacíos antes del primer día del mes
    for (let i = 0; i < firstDayIndex; i++) {
      this.days.push(null);
    }

    // Añadir los números de los días
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }
  }

  changeMonth(offset: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + offset);
    this.generateCalendar();
  }

}
