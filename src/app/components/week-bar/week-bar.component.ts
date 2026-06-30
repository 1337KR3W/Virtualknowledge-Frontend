import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { TimeStateService } from 'src/app/services/time-state';
import { es } from 'date-fns/locale/es';
@Component({
  selector: 'app-week-bar',
  templateUrl: './week-bar.component.html',
  styleUrls: ['./week-bar.component.scss'],
  imports: [IonicModule],
})
export class WeekBarComponent {

  public timeState = inject(TimeStateService);

  getWeekRange(): string {
    const start = startOfWeek(this.timeState.currentReferenceDate(), { weekStartsOn: 0 });
    const end = endOfWeek(this.timeState.currentReferenceDate(), { weekStartsOn: 0 });
    return `${format(start, 'dd MMM', { locale: es })} - ${format(end, 'dd MMM', { locale: es })}`;
  }

}
