

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importaciones de Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

/**
 * Interfaz para representar un día en la cuadrícula del calendario.
 */
interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  fullDate: Date;
}

@Component({
  selector: 'app-calendar-1',
  standalone: true,
  // Añadimos los módulos de Material Design
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './calendar-1.html',
  styleUrl: './calendar-1.scss',
  // Usamos el control flow nativo de Angular (@if, @for) y señales
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar1Component {
  // Nombres de los días de la semana (Lunes a Domingo)
  dayNames: string[] = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  // Estado principal con la fecha actual que se está visualizando (usa señales)
  currentDate = signal(new Date());

  // Señal para almacenar el día seleccionado
  selectedDay = signal<Date | null>(null);

  // Fecha de hoy para comparar y marcar el día actual
  private today = new Date();


  /**
   * Cálculo computado para mostrar el Mes y el Año en el encabezado.
   */
  currentMonthYear = computed(() => {
    // Usa toLocaleString para obtener el nombre del mes en el idioma local (ej: "noviembre")
    return this.currentDate().toLocaleDateString('en-EN', { year: 'numeric', month: 'long' });
  });

  /**
   * Genera toda la cuadrícula de días del calendario (computada).
   * Este es el núcleo de la lógica para ordenar los días en las 7 columnas.
   */
  calendarDays = computed<CalendarDay[]>(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    // 1. Obtener la cantidad de días en el mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 2. Determinar el día de la semana en que comienza el mes (0=Dom, 1=Lun, ...)
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Domingo) - 6 (Sábado)

    // Ajustamos para que Lunes sea el inicio (índice 0) y Domingo sea el final (índice 6)
    // startOffset es el número de celdas vacías al inicio (días del mes anterior)
    const startOffset = (firstDayOfMonth - 1 + 7) % 7;

    // 3. Preparar los datos del mes anterior para el relleno
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

    const days: CalendarDay[] = [];

    // --- Relleno de Días Anteriores (Días del mes anterior) ---
    for (let i = 0; i < startOffset; i++) {
      const dateNum = daysInPrevMonth - startOffset + i + 1;
      const fullDate = new Date(prevYear, prevMonth, dateNum);
      days.push({
        date: dateNum,
        isCurrentMonth: false,
        isToday: this.isSameDay(fullDate, this.today),
        fullDate: fullDate
      });
    }

    // --- Días del Mes Actual ---
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        isToday: this.isSameDay(fullDate, this.today),
        fullDate: fullDate
      });
    }

    // --- Relleno de Días Posteriores (Días del mes siguiente) ---
    // Asegura que la cuadrícula siempre tenga 42 celdas (6 semanas * 7 días)
    const totalCells = 42;
    const nextMonthFiller = totalCells - days.length;

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;

    for (let i = 1; i <= nextMonthFiller; i++) {
      const fullDate = new Date(nextYear, nextMonth, i);
      days.push({
        date: i,
        isCurrentMonth: false,
        isToday: this.isSameDay(fullDate, this.today),
        fullDate: fullDate
      });
    }

    return days;
  });


  // --- Métodos de Navegación ---

  goToPreviousMonth(): void {
    this.currentDate.update(date => {
      // Crea una nueva fecha, restando 1 al mes
      return new Date(date.getFullYear(), date.getMonth() - 1, 1);
    });
  }

  goToNextMonth(): void {
    this.currentDate.update(date => {
      // Crea una nueva fecha, sumando 1 al mes
      return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    });
  }

  selectDay(date: Date): void {
    this.selectedDay.set(date);
  }

  /**
   * Helper: Compara si dos fechas son el mismo día (ignorando la hora).
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}