import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { ProjectDTO } from 'src/app/models/projectDTO.model';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserDTO } from 'src/app/models/userDTO.model';
import { AbstractPage } from '../../abstract';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ProjectsPage extends AbstractPage implements OnInit, OnDestroy {

  private readonly dataMgmt = inject(DataManagementService);
  public currentWeekId: string = '2026-W15';
  public projects: ProjectDTO[] = [];
  public user: UserDTO | null = null;


  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserDTO>('userLogged');
    console.log('[PROJECTS] Usuario recuperado:', this.user);
    await this.loadProjects();
  }

  ionViewWillEnter() {
    this.dataMgmt.setBackButton(true);
  }

  async loadProjects() {
    if (this.user?.id) {
      try {
        this.projects = await this.dataMgmt.getProjects();

        console.log('[PROJECTS] Listado histórico cargado:', this.projects.length);
      } catch (error) {
        console.error('[PROJECTS] Error al cargar el listado global:', error);
      }
    }
  }

  public goBack() {
    this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' })//null, { animate: true, direction: 'back' }
  }

  ngOnDestroy() {
    this.dataMgmt.setBackButton(false);
  }

}
