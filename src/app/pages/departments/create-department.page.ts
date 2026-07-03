import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { UserResponseDTO } from 'src/app/models/userDTO.model';
import { DepartmentRequestDTO } from 'src/app/models/departmentDTO.model';

@Component({
    selector: 'app-create-department',
    templateUrl: './create-department.page.html',
    styleUrls: ['./create-department.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class CreateDepartmentPage extends AbstractPage {

    private readonly dataMgmt = inject(DataManagementService);
    private readonly toastCtrl = inject(ToastController);

    public departmentName: string = '';
    public allUsers: UserResponseDTO[] = [];
    public selectedUserIds: number[] = [];

    async ionViewWillEnter() {
        this.dataMgmt.setBackButton(true);

        try {
            this.allUsers = await this.dataMgmt.getAllUsers();
        } catch (error) {
            this.showToast('Error loading users list.', 'danger');
        }
    }

    async onCreateDepartment() {
        if (!this.departmentName || this.departmentName.trim() === '') {
            this.showToast('The department name is required.', 'warning');
            return;
        }

        const departmentRequest: DepartmentRequestDTO = {
            name: this.departmentName.trim(),
            userIds: this.selectedUserIds
        };

        try {
            await this.dataMgmt.createDepartment(departmentRequest);

            this.showToast('Department created successfully!', 'success');
            this.goBack();
        } catch (error) {
            this.showToast('Error creating department. It might already exist.', 'danger');
        }
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({
            message,
            duration: 2000,
            color
        });
        await toast.present();
    }
}