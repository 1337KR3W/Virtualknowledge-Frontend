import { Component, inject } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { TimeStateService } from 'src/app/services/time-state';
import { enUS } from 'date-fns/locale/en-US';
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
    return `${format(start, 'dd MMM', { locale: enUS })} - ${format(end, 'dd MMM', { locale: enUS })}`;
  }

}
