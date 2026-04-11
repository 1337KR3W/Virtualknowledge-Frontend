import { Component, inject, Input, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { UserDTO } from 'src/app/models/userDTO.model';
import { AbstractPage } from 'src/app/pages/abstract';
import { DataManagementService } from 'src/app/services/data-management.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.scss'],
  imports: [IonicModule],
})
export class UserNavComponent extends AbstractPage implements OnInit {



  private readonly dataMgmt = inject(DataManagementService);

  public user: UserDTO | null = null;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');
  }

  async goToProjects() {

    this.nav.navigateForward('projects');
  }

  async logout() {
    await this.dataMgmt.logout();
    this.nav.navigateRoot('login');

  }

}
