import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataManagementService } from 'src/app/services/data-management.service';
import { IonicModule } from "@ionic/angular";
import { AbstractPage } from '../abstract';
import { CalendarComponent } from 'src/app/components/calendar/calendar.component';
import { TimeSheetComponent } from "src/app/components/time-sheet/time-sheet.component";
import { WeekBarComponent } from "src/app/components/week-bar/week-bar.component";
import { UserNavComponent } from "src/app/components/user-nav/user-nav.component";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CalendarComponent, TimeSheetComponent, WeekBarComponent, UserNavComponent]
})
export class WelcomePage extends AbstractPage implements OnInit {

  private readonly dataMgmt = inject(DataManagementService);

  public appVersion: string = 'Cargando...';

  async ngOnInit() {
    const versionData = await this.dataMgmt.getValueFromStorage<any>('lastSync');
    this.appVersion = versionData || '1.0.0';
  }

  ionViewWillEnter() {
    this.dataMgmt.setBackButton(false);
  }



}
