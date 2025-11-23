import { ChangeDetectionStrategy, Component, computed, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';

// Importaciones de Angular Material (Aún necesarias en el TS)
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// --- Definiciones de Tipos ---

/** Interfaz para un proyecto de la hoja de horas. */
interface Project {
  id: string;
  name: string;
}

/** Interfaz para la entrada de horas y comentarios por día. */
interface TimeEntry {
  hours: number | null;
  comment: string;
}

/** Tipo para almacenar todas las entradas de tiempo: { [projectId]: { [dateKey]: TimeEntry } } */
type TimesheetData = Record<string, Record<string, TimeEntry>>;

// --- Componente Principal Timesheet ---
@Component({
  selector: 'app-timesheet-1',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  templateUrl: './timesheet-1.html', // Referencia al HTML
  styleUrls: ['./timesheet-1.scss'],    // Referencia al CSS
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Timesheet1Component implements OnInit, OnDestroy {

  private readonly LOCALE = 'en-EN';
  private readonly LOCAL_STORAGE_KEY_DATA = 'timesheetData';
  private readonly LOCAL_STORAGE_KEY_COMMENT = 'timesheetGlobalComment';
  private destroy$ = new Subject<void>();
  private saveSubject = new Subject<void>(); // Subject para gestionar el autoguardado

  // --- Datos Mockeados y Estáticos ---
  private readonly MOCKED_PROJECTS: Project[] = [
    { id: 'PMO-1498', name: 'Diseño de Plataforma Web' },
    { id: 'PMO-1499', name: 'Migración a la Nube' },
    { id: 'PMO-1500', name: 'Mantenimiento Básico' },
    { id: 'PMO-1501', name: 'Soporte a Producción' },
    { id: 'PMO-1502', name: 'Desarrollo de API' },
  ];

  // Nombres de los días de la semana (Lunes a Viernes)
  public readonly dayNames: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  // --- Estado con Signals ---
  public projects = signal<Project[]>(this.MOCKED_PROJECTS);

  // La fecha que define la semana actual que estamos viendo
  public currentReferenceDate = signal(this.getStartOfWeek(new Date()));

  // Datos de horas y comentarios
  public timesheetData = signal<TimesheetData>({});

  // Comentario global
  public globalComment = signal<string>('');


  // --- Propiedades Computadas ---

  /**
   * Calcula y devuelve las 5 fechas (Lunes a Viernes) de la semana de la currentReferenceDate.
   */
  public weekDates = computed<Date[]>(() => {
    const startOfWeek = this.currentReferenceDate();
    const dates: Date[] = [];

    // Genera las 5 fechas de Lunes a Viernes
    for (let i = 0; i < 5; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      dates.push(day);
    }
    return dates;
  });

  /**
   * Calcula la suma total de horas ingresadas de Lunes a Viernes.
   */
  public totalHours = computed(() => {
    const data = this.timesheetData();
    let total = 0;
    const workDaysKeys = this.weekDates().map(d => this.getDateKey(d));

    for (const projectId in data) {
      for (const dateKey of workDaysKeys) {
        const entry = data[projectId][dateKey];
        if (entry && typeof entry.hours === 'number' && !isNaN(entry.hours)) {
          total += entry.hours;
        }
      }
    }
    return total.toFixed(2);
  });

  // --- Ciclo de Vida y Persistencia ---

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadFromLocalStorage();
    this.setupAutoSave();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Guardado final al destruir
    this.saveToLocalStorage(false);
  }

  /**
   * Configura el autoguardado usando debounce para no guardar con cada pulsación de tecla.
   */
  private setupAutoSave(): void {
    this.saveSubject.pipe(
      debounceTime(1000), // Espera 1 segundo después de la última entrada
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.saveToLocalStorage(true);
    });
  }

  // --- Métodos de Persistencia (LocalStorage) ---

  /**
   * Carga los datos de la hoja de horas desde LocalStorage.
   */
  private loadFromLocalStorage(): void {
    try {
      // 1. Cargar Datos de la Tabla
      const savedData = localStorage.getItem(this.LOCAL_STORAGE_KEY_DATA);
      if (savedData) {
        this.timesheetData.set(JSON.parse(savedData));
      } else {
        this.initializeMockData(); // Inicializar si no hay datos guardados
      }

      // 2. Cargar Comentario Global
      const savedComment = localStorage.getItem(this.LOCAL_STORAGE_KEY_COMMENT);
      if (savedComment !== null) {
        this.globalComment.set(savedComment);
      }
    } catch (e) {
      console.error('Error al cargar datos de LocalStorage:', e);
      this.initializeMockData(); // Fallback si falla el parseo
    }
  }

  /**
   * Guarda los datos de la hoja de horas en LocalStorage.
   * @param showNotification Si debe mostrar una notificación de guardado.
   */
  private saveToLocalStorage(showNotification: boolean): void {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY_DATA, JSON.stringify(this.timesheetData()));
      localStorage.setItem(this.LOCAL_STORAGE_KEY_COMMENT, this.globalComment());

      if (showNotification) {
        this.snackBar.open('Guardado automático', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
        });
      }
    } catch (e) {
      console.error('Error al guardar datos en LocalStorage:', e);
    }
  }

  // --- Métodos de Ayuda y Estado ---

  /**
   * Obtiene la fecha del Lunes de la semana dada.
   */
  private getStartOfWeek(date: Date): Date {
    const dayOfWeek = (date.getDay() - 1 + 7) % 7; // 0 (Lun) a 6 (Dom)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0); // Limpiar hora para consistencia
    return startOfWeek;
  }

  /**
   * Inicializa la señal timesheetData con algunos valores predeterminados.
   */
  private initializeMockData(): void {
    const dates = this.weekDates(); // Usará la semana por defecto
    const data: TimesheetData = {};

    const mockHoursMap = {
      'PMO-1498': [5, 4, 6, 6, 3], // L-V
      'PMO-1499': [5, 5, 2, 2, 6],
      'PMO-1500': [4, 5, 3, 4, 5],
      'PMO-1501': [3, 5, 6, 5, 5],
      'PMO-1502': [5, 4, 5, 1, 5],
    };

    this.MOCKED_PROJECTS.forEach((project, index) => {
      data[project.id] = {};
      dates.forEach((date, i) => {
        const dateKey = this.getDateKey(date);
        const hours = mockHoursMap[project.id as keyof typeof mockHoursMap]?.[i] ?? null;

        data[project.id][dateKey] = {
          hours: hours,
          comment: (hours && hours > 0) ? `Revisión de código e integración de tarea ${i + 1}.` : ''
        };
      });
    });

    this.timesheetData.set(data);
  }

  /**
   * Genera una clave de fecha consistente (YYYY-MM-DD).
   */
  public getDateKey(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', this.LOCALE);
  }

  /**
   * Obtiene la entrada de tiempo para un proyecto y una fecha específica, asegurando la existencia de la estructura.
   */
  public getTimeEntry(projectId: string, date: Date): TimeEntry {
    const dateKey = this.getDateKey(date);
    const data = this.timesheetData();

    // Si el proyecto o la fecha no existe, devuelve una estructura vacía temporalmente para evitar errores
    if (!data[projectId] || !data[projectId][dateKey]) {
      // Retornar un objeto mock para que el template funcione sin actualizar la señal
      return { hours: null, comment: '' };
    }
    return data[projectId][dateKey];
  }

  /**
   * Calcula el total de horas para un proyecto específico para la semana visible.
   */
  public getTotalHoursByProject(projectId: string): string {
    const data = this.timesheetData();
    let total = 0;
    const workDaysKeys = this.weekDates().map(d => this.getDateKey(d));

    if (data[projectId]) {
      for (const dateKey of workDaysKeys) {
        const entry = data[projectId][dateKey];
        if (entry && typeof entry.hours === 'number' && !isNaN(entry.hours)) {
          total += entry.hours;
        }
      }
    }
    return total.toFixed(2);
  }

  // --- Métodos de Interacción ---

  /**
   * Actualiza las horas trabajadas para una entrada específica y dispara el guardado.
   * Se llama desde (ngModelChange) en el input.
   */
  public updateHours(projectId: string, date: Date, newHours: number | string | null): void {
    let hours: number | null;

    // Conversión y validación: acepta null, string vacío, o number
    if (newHours === null || newHours === '') {
      hours = null;
    } else {
      hours = parseFloat(newHours as string);
      if (isNaN(hours) || hours < 0 || hours > 24) {
        hours = null; // Ignorar si es inválido
      }
    }

    const dateKey = this.getDateKey(date);

    this.timesheetData.update(data => {
      // Asegura que la estructura existe
      if (!data[projectId]) data[projectId] = {};
      if (!data[projectId][dateKey]) data[projectId][dateKey] = { hours: null, comment: '' };

      const newData = { ...data };
      newData[projectId] = {
        ...newData[projectId],
        [dateKey]: {
          ...newData[projectId][dateKey],
          hours: hours
        }
      };
      return newData;
    });

    this.saveSubject.next();
  }

  /**
   * Actualiza el comentario global y dispara el guardado.
   */
  public updateGlobalComment(comment: string): void {
    this.globalComment.set(comment);
    this.saveSubject.next();
  }

  /**
   * Abre un modal (simulado con prompt) para editar el comentario de la entrada de tiempo.
   */
  public editComment(projectId: string, date: Date): void {
    const dateKey = this.getDateKey(date);
    let entry = this.getTimeEntry(projectId, date);

    // Asegurar que la estructura existe en la señal antes de usarla
    this.timesheetData.update(data => {
      if (!data[projectId]) data[projectId] = {};
      if (!data[projectId][dateKey]) data[projectId][dateKey] = { hours: null, comment: '' };
      entry = data[projectId][dateKey]; // Asignar la referencia real
      return data; // Devolver sin cambios de estructura, solo para asegurar existencia
    });

    // Usaremos la función prompt como sustituto temporal para MatDialog.
    const newComment = prompt(
      `Editar comentario para ${projectId} el ${date.toLocaleDateString(this.LOCALE)}:\n\nComentario actual:`,
      entry.comment
    );

    if (newComment !== null) {
      this.timesheetData.update(data => {
        const newData = { ...data };
        newData[projectId] = {
          ...newData[projectId],
          [dateKey]: {
            ...newData[projectId][dateKey],
            comment: newComment
          }
        };
        return newData;
      });
      this.saveSubject.next();
    }
  }

  /**
   * Lógica de navegación para ir a la semana anterior.
   */
  public goToPreviousWeek(): void {
    this.currentReferenceDate.update(date => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
    // Forzar la recarga de datos si la semana ha cambiado (aunque con Signals es automático)
    this.saveToLocalStorage(false);
    this.loadFromLocalStorage();
  }

  /**
   * Lógica de navegación para ir a la semana siguiente.
   */
  public goToNextWeek(): void {
    this.currentReferenceDate.update(date => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
    // Forzar la recarga de datos si la semana ha cambiado
    this.saveToLocalStorage(false);
    this.loadFromLocalStorage();
  }
}