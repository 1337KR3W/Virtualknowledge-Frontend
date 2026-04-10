import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
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
    // Añadimos un log para ver qué está pasando
    if (this.user?.id) {
      try {
        this.projects = await this.dataMgmt.getProjects(this.user.id);
        console.log('[PROJECTS] Lista cargada:', this.projects);
      } catch (error) {
        console.error('[PROJECTS] Error al cargar:', error);
      }
    } else {
      console.warn('[PROJECTS] No hay ID de usuario disponible');
    }
  }

  public goBack() {
    this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' })//null, { animate: true, direction: 'back' }
  }

  ngOnDestroy() {
    this.dataMgmt.setBackButton(false);
  }

}
