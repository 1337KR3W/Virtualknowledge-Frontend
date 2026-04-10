import { Component, inject } from '@angular/core';

import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons'; // 1. Importar addIcons
import { globe, logOutOutline, shieldCheckmarkOutline, gitBranchOutline, folderOpenOutline, briefcaseOutline } from 'ionicons/icons'; // 2. Importar los iconos específicos
import { DataManagementService } from './services/data-management.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AsyncPipe, CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [IonicModule, AsyncPipe, CommonModule],
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
      "briefcase-outline": briefcaseOutline
    });
  }

  ionViewWillEnter() {
    // Se ejecuta SIEMPRE que entras a la pantalla, incluso al volver atrás
    this.dataMgmt.setBackButton(false);
  }

  initializeApp() {
    // Escuchamos los cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la ruta NO es 'login', mostramos el layout
      this.showLayout = !event.urlAfterRedirects.includes('login');
    });
  }
}
