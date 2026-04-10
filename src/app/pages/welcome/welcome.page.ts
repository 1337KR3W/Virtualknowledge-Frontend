import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserDTO } from 'src/app/models/userDTO.model';
import { IonicModule } from "@ionic/angular";
import { AbstractPage } from '../abstract';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class WelcomePage extends AbstractPage implements OnInit {

  private readonly dataMgmt = inject(DataManagementService);

  public user: UserDTO | null = null;
  public appVersion: string = 'Cargando...';

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');

    const versionData = await this.dataMgmt.getValueFromStorage<any>('lastSync');
    this.appVersion = versionData || '1.0.0';
  }

  async logout() {
    await this.dataMgmt.logout();
    this.nav.navigateRoot('login');
    // Aquí podrías añadir la navegación al login
  }

}
