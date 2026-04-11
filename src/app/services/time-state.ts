import { Injectable, signal } from '@angular/core';
import { addDays, startOfWeek, format, subWeeks, addWeeks } from 'date-fns';
import { map, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class TimeStateService {
  // Usamos un Signal para que sea reactivo y eficiente
  public currentReferenceDate = signal<Date>(new Date());

  public weekId$: Observable<string> = toObservable(this.currentReferenceDate).pipe(
    map(date => format(date, "RRRR-'W'II"))
  );


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