import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';

@Component({
    selector: 'app-edit-project',
    templateUrl: './edit-project.page.html',
    styleUrls: ['./edit-project.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule]
})
export class EditProjectPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastCtrl = inject(ToastController);

    public project: any = { id: null, name: '', description: '', startDate: '', endDate: '', departmentId: null, userIds: [] };
    public allUsers: any[] = [];
    public allDepartments: any[] = [];
    private isInitialLoad = true;

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            await this.loadData(Number(id));
        }
    }

    async loadData(id: number) {
        try {
            this.isInitialLoad = true;
            const projectData = await this.dataMgmt.getProjectById(id);
            const [depts, users] = await Promise.all([
                this.dataMgmt.getDepartments(),
                this.dataMgmt.getUsersByDepartment(projectData.departmentId)
            ]);

            this.allDepartments = depts;
            this.allUsers = users;
            this.project = {
                ...projectData,
                departmentId: projectData.departmentId ? Number(projectData.departmentId) : null,
                userIds: Array.isArray(projectData.userIds)
                    ? projectData.userIds.map(uid => Number(uid))
                    : []
            };
            this.isInitialLoad = false;
        } catch (error) {
            console.error(error);
            this.showToast('Error loading data', 'danger');
        }
    }

    async saveChanges() {
        try {
            await this.dataMgmt.updateProject(this.project.id, this.project);
            this.showToast('Updated project successfully!', 'success');
            this.nav.back();
        } catch (error) {
            this.showToast('Error saving changes', 'danger');
        }
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, color });
        await toast.present();
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' })
    }


    public compareWith(o1: any, o2: any) {
        return Number(o1) === Number(o2);
    }

    public async onDepartmentChange(deptId: number) {

        if (this.isInitialLoad) return;

        this.project.userIds = [];

        try {
            this.allUsers = await this.dataMgmt.getUsersByDepartment(deptId);
            this.showToast('Updated users for new department', 'medium');
        } catch (error) {
            this.allUsers = [];
            this.showToast('Error loading users for the selected department', 'danger');
        }
    }
}