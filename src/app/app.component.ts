import { Component, inject } from '@angular/core';

import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons';
import { globe, logOutOutline, shieldCheckmarkOutline, gitBranchOutline, folderOpenOutline, briefcaseOutline, createOutline, cloudUploadOutline, calendarNumberOutline, personAddOutline, businessOutline, addCircleOutline, arrowBackOutline, saveOutline, refreshOutline, downloadOutline, settingsOutline, listOutline, trashOutline, documentTextOutline, personOutline, menuOutline, menu } from 'ionicons/icons'; // 2. Importar los iconos específicos
import { DataManagementService } from './services/data-management.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class AppComponent {
  private readonly dataMgmt = inject(DataManagementService);
  private readonly router = inject(Router);
  public showLayout: boolean = false;
  showBack$ = this.dataMgmt.showBackButton;

  constructor() {
    this.initializeApp();
    addIcons({
      'globe': globe,
      'log-out-outline': logOutOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'git-branch-outline': gitBranchOutline,
      "folder-open-outline": folderOpenOutline,
      "briefcase-outline": briefcaseOutline,
      "create-outline": createOutline,
      "cloud-upload-outline": cloudUploadOutline,
      "calendar-number-outline": calendarNumberOutline,
      "person-add-outline": personAddOutline,
      "business-outline": businessOutline,
      "add-circle-outline": addCircleOutline,
      "arrow-back-outline": arrowBackOutline,
      "save-outline": saveOutline,
      "refresh-outline": refreshOutline,
      "download-outline": downloadOutline,
      "settings-outline": settingsOutline,
      "list-outline": listOutline,
      "trash-outline": trashOutline,
      "document-text-outline": documentTextOutline,
      "person-outline": personOutline,
      "menu": menu

    });
  }

  ionViewWillEnter() {
    this.dataMgmt.setBackButton(false);
  }

  initializeApp() {
    this.dataMgmt.checkAdminStatus();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {

      this.showLayout = !event.urlAfterRedirects.includes('login');
    });
  }
}
