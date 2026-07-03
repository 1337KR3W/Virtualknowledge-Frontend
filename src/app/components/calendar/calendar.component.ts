import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import { TimeStateService } from 'src/app/services/time-state';
import { endOfWeek, isWithinInterval, startOfWeek } from 'date-fns';
@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, IonicModule]
})
export class CalendarComponent implements OnInit {
  public readonly timeState = inject(TimeStateService);
  public displayMonth: string = '';
  public displayYear: number = 0;
  public days: (number | null)[] = [];
  public weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.timeState.weekId$.subscribe(() => {
      this.generateCalendar();
    });
  }

  generateCalendar() {
    const referenceDate = this.timeState.currentReferenceDate();
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();

    this.displayYear = year;
    this.displayMonth = new Intl.DateTimeFormat('en-EN', { month: 'long' }).format(referenceDate);

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      this.days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      this.days.push(i);
    }
  }

  isDayInSelectedWeek(day: number | null): boolean {
    if (!day) return false;

    const dateToCheck = new Date(this.displayYear, this.timeState.currentReferenceDate().getMonth(), day);
    const referenceDate = this.timeState.currentReferenceDate();

    const start = startOfWeek(referenceDate, { weekStartsOn: 0 });
    const end = endOfWeek(referenceDate, { weekStartsOn: 0 });

    return isWithinInterval(dateToCheck, { start, end });
  }

  changeMonth(offset: number) {
    const newDate = new Date(this.timeState.currentReferenceDate());
    newDate.setMonth(newDate.getMonth() + offset);
    this.timeState.currentReferenceDate.set(newDate);
  }
}
