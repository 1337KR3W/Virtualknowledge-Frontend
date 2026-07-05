import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { ProjectResponseDTO } from 'src/app/models/projectDTO.model';
import { UserResponseDTO } from 'src/app/models/userDTO.model';

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
  public projects: ProjectResponseDTO[] = [];
  public user: UserResponseDTO | null = null;

  async ngOnInit() {
    this.user = await this.dataMgmt.getValueFromStorage<UserResponseDTO>('userLogged');
    await this.loadProjects();
  }

  ionViewWillEnter() {
    this.dataMgmt.setBackButton(true);
  }

  async loadProjects() {
    try {
      this.projects = await this.dataMgmt.getProjects();
    } catch (error) {
      console.error('[PROJECTS] Error al cargar el listado de proyectos:', error);
    }
  }

  public goBack() {
    this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
  }

  ngOnDestroy() {
    this.dataMgmt.setBackButton(false);
  }
}