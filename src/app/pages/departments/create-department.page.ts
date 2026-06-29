import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';

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

    ionViewWillEnter() {
        this.dataMgmt.setBackButton(true);
    }

    async onCreateDepartment() {
        if (!this.departmentName || this.departmentName.trim() === '') {
            this.showToast('El nombre del departamento es obligatorio.', 'warning');
            return;
        }

        try {
            await this.dataMgmt.createDepartment(this.departmentName.trim());
            this.showToast('Departamento creado correctamente.', 'success');
            this.departmentName = '';
            this.goBack();
        } catch (error) {
            this.showToast('Error al crear el departamento. Puede que ya exista.', 'danger');
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