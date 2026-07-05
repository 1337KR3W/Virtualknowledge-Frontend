import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.page.html',
    styleUrls: ['./edit-user.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule]
})
export class EditUserPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly route = inject(ActivatedRoute);
    private readonly toastCtrl = inject(ToastController);

    public user: any = {
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        departmentId: null,
        roleId: null,
        status: 'ACTIVE'
    };

    public allDepartments: any[] = [];

    async ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            await this.loadData(Number(id));
        }
    }

    async loadData(id: number) {
        try {

            const [userData, depts] = await Promise.all([
                this.dataMgmt.getUserById(id),
                this.dataMgmt.getDepartments()
            ]);

            this.allDepartments = depts;
            this.user = { ...userData };
        } catch (error) {
            console.error(error);
            this.showToast('Error al cargar datos del usuario', 'danger');
        }
    }

    async saveChanges() {
        try {
            await this.dataMgmt.updateUser(this.user.id, this.user);
            this.showToast('Usuario actualizado con éxito', 'success');
            this.nav.back();
        } catch (error) {
            this.showToast('Error al guardar cambios', 'danger');
        }
    }

    public compareWith(o1: any, o2: any) {
        return o1 && o2 ? Number(o1) === Number(o2) : o1 === o2;
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, color });
        await toast.present();
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }
}