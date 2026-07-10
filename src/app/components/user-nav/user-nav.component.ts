import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { UserResponseDTO } from 'src/app/models/userDTO.model';

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

  public user: UserResponseDTO | null = null;
  public isAdmin$ = this.dataMgmt.isAdmin$;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserResponseDTO>('userLogged');
    await this.dataMgmt.checkAdminStatus();
  }

  async goToManageUsers() {
    this.nav.navigateForward('admin/manage-users');
  }

  async goToRegister() {
    this.nav.navigateForward('admin/register');
  }

  async goToProjects() {
    this.nav.navigateForward('projects');
  }

  async goToCreateProject() {
    this.nav.navigateForward('admin/create-project');
  }

  async goToManageProjects() {
    this.nav.navigateForward('admin/manage-projects');
  }

  async goToDepartments() {
    this.nav.navigateForward('departments/my-department');
  }

  async goToCreateDepartment() {
    this.nav.navigateForward('admin/create-department');
  }

  async goToManageDepartments() {
    this.nav.navigateForward('admin/manage-departments');
  }



  public getDisplayRole(): string {
    if (!this.user || !this.user.roleName || this.user.roleName.length === 0) {
      return '';
    }

    const role = Array.isArray(this.user.roleName) ? this.user.roleName[0] : this.user.roleName;
    return role.replace('ROLE_', '');
  }

  async logout() {
    await this.dataMgmt.logout();
    this.nav.navigateRoot('login');

  }

}
