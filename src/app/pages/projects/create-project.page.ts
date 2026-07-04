import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { UserResponseDTO } from 'src/app/models/userDTO.model';
import { ProjectRequestDTO } from 'src/app/models/projectDTO.model';

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
    private readonly route = inject(ActivatedRoute);

    public departments: any[] = [];
    public filteredUsers: UserResponseDTO[] = [];
    public isEditMode = false;
    private projectId: number | null = null;

    public projectData = {
        name: '',
        description: '',
        startDate: '',
        endDate: '' as string | null,
        departmentId: null as number | null,
        userIds: [] as number[]
    };

    async ngOnInit() {
        try {
            this.departments = await this.dataMgmt.getDepartments();
            const idParam = this.route.snapshot.paramMap.get('id');
            if (idParam) {
                this.isEditMode = true;
                this.projectId = Number(idParam);
                await this.loadProjectData(this.projectId);
            }
        } catch (error: any) {
            this.showToast('Error loading initial data', 'danger');
        }
    }

    async loadProjectData(id: number) {
        try {
            const project = await this.dataMgmt.getProjectById(id);
            this.projectData = {
                name: project.name,
                description: project.description,
                startDate: project.startDate,
                endDate: project.endDate || '',
                departmentId: project.departmentId,
                userIds: project.userIds || []
            };
            await this.onDepartmentChange();
        } catch (error: any) {
            this.showToast('Error loading data from project', 'danger');
        }
    }

    async onDepartmentChange() {

        this.filteredUsers = [];

        if (this.projectData.departmentId) {
            try {
                const result = await this.dataMgmt.getUsersByDepartment(this.projectData.departmentId);

                if (Array.isArray(result)) {
                    this.filteredUsers = result;
                } else {
                    console.error('[ERROR] The service did not return an array:', result);
                    this.filteredUsers = [];
                }
            } catch (error: any) {
                console.error('[ERROR] Callback failed:', error);
                this.showToast('Error loading users', 'danger');
                this.filteredUsers = [];
            }
        }
    }

    async onSave() {
        const { name, description, startDate, departmentId, userIds } = this.projectData;

        if (!name || !description || !startDate || departmentId === null) {
            this.showToast('Project name, start date and department are required', 'warning');
            return;
        }

        const projectRequest: ProjectRequestDTO = {
            name,
            description,
            startDate: this.projectData.startDate + 'T00:00:00',
            endDate: this.projectData.endDate ? this.projectData.endDate + 'T00:00:00' : null,
            departmentId: departmentId,
            userIds: userIds || []
        };

        try {
            if (this.isEditMode && this.projectId) {
                await this.dataMgmt.updateProject(this.projectId, projectRequest);
                this.showToast('Project created successfully!', 'success');
            } else {
                await this.dataMgmt.createProject(projectRequest);
                this.showToast('Project created successfully!', 'success');
            }
            this.goBack();
        } catch (error: any) {
            const errorMessage = (error.error && error.error.details)
                ? error.error.details
                : 'Unexpected error occurred while creating new project';

            this.showToast(errorMessage, 'warning')
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