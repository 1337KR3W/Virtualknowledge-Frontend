import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { ProjectResponseDTO } from 'src/app/models/projectDTO.model';

@Component({
    selector: 'app-manage-projects',
    templateUrl: './manage-projects.page.html',
    styleUrls: ['./manage-projects.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class ManageProjectsPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly alertCtrl = inject(AlertController);
    private readonly toastCtrl = inject(ToastController);

    public projects: ProjectResponseDTO[] = [];


    ionViewWillEnter() {
        this.loadProjects();
    }

    async ngOnInit() {
        await this.loadProjects();
    }

    async loadProjects() {
        try {
            this.projects = await this.dataMgmt.getAllProjectsAdmin();
        } catch (error) {
            this.showToast('Error al cargar los proyectos', 'danger');
        }
    }

    async deleteProject(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm Delete',
            message: '¿Do you want to delete this project? This action cannot be undone.',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Borrar',
                    role: 'destructive',
                    handler: async () => {
                        try {
                            await this.dataMgmt.deleteProject(id);
                            this.showToast('Proyecto eliminado', 'success');
                            await this.loadProjects();
                        } catch (error) {
                            this.showToast('Error al eliminar el proyecto', 'danger');
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    editProject(project: ProjectResponseDTO) {
        this.nav.navigateForward(`/admin/edit-project/${project.id}`);
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, color });
        await toast.present();
    }
}