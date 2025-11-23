import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-week-number-bar-1',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatToolbarModule],
  templateUrl: './week-number-bar-1.html',
  styleUrl: './week-number-bar-1.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class WeekNumberBar1Component {
  // Estado principal: La fecha que define la semana actual que estamos viendo.
  public currentDate = signal(new Date());

  /**
   * Propiedad Computada: Calcula el número de semana (ISO 8601), el mes y el año de la fecha actual.
   * Se actualiza automáticamente cuando 'currentDate' cambia.
   */
  public weekInfo = computed(() => {
    const date = this.currentDate();

    // 1. Calcular el número de semana (ISO 8601)
    const weekNumber = this.getWeekNumber(date);

    // 2. Formatear el mes y el año
    const monthYear = date.toLocaleDateString('en-EN', { year: 'numeric', month: 'long' });

    return { weekNumber, monthYear };
  });


  // --- Métodos de Navegación ---

  /**
   * Retrocede una semana (7 días) a partir de la fecha actual.
   */
  public goToPreviousWeek(): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      // Restar 7 días
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  }

  /**
   * Avanza una semana (7 días) a partir de la fecha actual.
   */
  public goToNextWeek(): void {
    this.currentDate.update(date => {
      const newDate = new Date(date);
      // Sumar 7 días
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  }

  // --- Lógica de Cálculo de Número de Semana (ISO 8601) ---

  /**
   * Calcula el número de semana del año (ISO 8601).
   * La semana 1 es la que contiene el primer jueves del año.
   * @param d La fecha de la que se quiere obtener el número de semana.
   * @returns El número de semana (1 a 53).
   */
  private getWeekNumber(d: Date): number {
    // Clona la fecha, ya que manipulará la hora
    const date = new Date(d.getTime());

    // Ajustar a medianoche (para evitar problemas de DST)
    date.setHours(0, 0, 0, 0);

    // Mueve la fecha al Jueves de esa semana.
    // El Jueves siempre está en la misma semana ISO.
    // El 4 representa el Jueves (0=Dom, 1=Lun, ..., 4=Jue)
    // Se ajusta para que el Jueves sea el día 4.
    // date.getDay() - 4: Si es Lunes (1), da -3. Si es Jueves (4), da 0.
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));

    // Obtener el inicio del año (1 de Enero)
    const yearStart = new Date(date.getFullYear(), 0, 1);

    // Calcular la diferencia en días desde el inicio del año hasta el Jueves
    const weekNumber = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

    return weekNumber;
  }
}
