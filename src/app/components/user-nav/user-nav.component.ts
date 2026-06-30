import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { UserDTO } from 'src/app/models/userDTO.model';
import { AbstractPage } from 'src/app/pages/abstract';
import { DataManagementService } from 'src/app/services/data-management.service';

@Component({
  selector: 'app-user-nav',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.scss'],
  imports: [IonicModule, AsyncPipe],
})
export class UserNavComponent extends AbstractPage implements OnInit {

  private readonly dataMgmt = inject(DataManagementService);

  public user: UserDTO | null = null;
  public isAdmin$ = this.dataMgmt.isAdmin$;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');
    await this.dataMgmt.checkAdminStatus();
  }

  async goToProjects() {
    this.nav.navigateForward('projects');
  }

  async goToRegister() {
    this.nav.navigateForward('admin/register');
  }

  async goToCreateDepartment() {
    this.nav.navigateForward('admin/create-department');
  }

  async goToCreateProject() {
    this.nav.navigateForward('admin/create-project');
  }

  public getDisplayRole(): string {
    if (!this.user || !this.user.roles || this.user.roles.length === 0) {
      return '';
    }
    // Asumiendo que roles es un array de strings, tomamos el primero
    const role = Array.isArray(this.user.roles) ? this.user.roles[0] : this.user.roles;
    return role.replace('ROLE_', '');
  }

  async logout() {
    await this.dataMgmt.logout();
    this.nav.navigateRoot('login');

  }

}
