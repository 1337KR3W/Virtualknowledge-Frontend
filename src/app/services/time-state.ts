import { Injectable, signal } from '@angular/core';
import { addDays, startOfWeek, format, subWeeks, addWeeks } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class TimeStateService {
  // Usamos un Signal para que sea reactivo y eficiente
  public currentReferenceDate = signal<Date>(new Date());

  // Devuelve el ID de la semana (ej: 2024-W15) para el DTO
  get weekId() {
    return format(this.currentReferenceDate(), "RRRR-'W'II");
  }

  nextWeek() {
    this.currentReferenceDate.set(addWeeks(this.currentReferenceDate(), 1));
  }

  prevWeek() {
    this.currentReferenceDate.set(subWeeks(this.currentReferenceDate(), 1));
  }

  goToToday() {
    this.currentReferenceDate.set(new Date());
  }
}