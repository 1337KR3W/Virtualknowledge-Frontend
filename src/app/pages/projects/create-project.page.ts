import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { UserDTO } from 'src/app/models/userDTO.model';
import { AbstractPage } from '../abstract';

@Component({
    selector: 'app-create-project',
    templateUrl: './create-project.page.html',
    styleUrls: ['./create-project.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class CreateProjectPage extends AbstractPage implements OnInit {

    private readonly dataMgmt = inject(DataManagementService);
    private readonly toastCtrl = inject(ToastController);

    public departments: any[] = [];
    public filteredUsers: UserDTO[] = [];

    public projectData = {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        departmentId: null as number | null,
        userIds: [] as number[] | []
    };

    ionViewWillEnter() {
        this.dataMgmt.setBackButton(true);
    }

    async ngOnInit() {
        try {
            this.departments = await this.dataMgmt.getDepartments();
        } catch (error) {
            this.showToast('Error al cargar departamentos', 'danger');
        }
    }

    async onDepartmentChange() {
        this.projectData.userIds = [];
        this.filteredUsers = [];

        if (this.projectData.departmentId) {
            try {
                this.filteredUsers = await this.dataMgmt.getUsersByDepartment(this.projectData.departmentId);
            } catch (error) {
                this.showToast('Error al cargar los usuarios del departamento', 'danger');
            }
        }
    }

    async onCreateProject() {
        const { name, description, startDate, departmentId, userIds } = this.projectData;


        if (!name || !description || !startDate || !departmentId) {
            this.showToast('Todos los campos son obligatorios.', 'warning');
            return;
        }

        try {
            await this.dataMgmt.createProject({
                name,
                description,
                startDate,
                endDate: this.projectData.endDate || undefined,
                departmentId: departmentId!,
                userIds: userIds || []
            });

            this.showToast('Proyecto creado exitosamente.', 'success');
            this.goBack();
        } catch (error) {
            this.showToast('Error al crear el proyecto.', 'danger');
        }
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, color });
        await toast.present();
    }
}