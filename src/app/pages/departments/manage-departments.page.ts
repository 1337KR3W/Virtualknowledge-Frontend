import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';

@Component({
    selector: 'app-manage-departments',
    templateUrl: './manage-departments.page.html',
    styleUrls: ['./manage-departments.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class ManageDepartmentsPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly alertCtrl = inject(AlertController);

    public departments: any[] = [];

    ionViewWillEnter() {
        this.loadDepartments();
    }

    async ngOnInit() {
        await this.loadDepartments();
    }

    async loadDepartments() {
        this.departments = await this.dataMgmt.getDepartments();
    }

    async deleteDepartment(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Confirmar eliminación',
            message: '¿Borrar este departamento?',
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Borrar',
                    role: 'destructive',
                    handler: async () => {
                        await this.dataMgmt.deleteDepartment(id);
                        await this.loadDepartments();
                    }
                }
            ]
        });
        await alert.present();
    }

    editDepartment(dept: any) {
        this.nav.navigateForward(`/admin/edit-department/${dept.id}`);
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' })
    }
}