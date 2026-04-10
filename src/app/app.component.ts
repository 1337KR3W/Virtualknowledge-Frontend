import { Component } from '@angular/core';

import { IonicModule } from "@ionic/angular";
import { addIcons } from 'ionicons'; // 1. Importar addIcons
import { globe, logOutOutline, shieldCheckmarkOutline, gitBranchOutline } from 'ionicons/icons'; // 2. Importar los iconos específicos
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule],
})
export class AppComponent {
  constructor() {
    addIcons({
      'globe': globe,
      'log-out-outline': logOutOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'git-branch-outline': gitBranchOutline,
    });
  }
}
