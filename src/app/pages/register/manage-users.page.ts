import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { UserResponseDTO } from 'src/app/models/userDTO.model';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.page.html',
    styleUrls: ['./manage-users.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule]
})
export class ManageUsersPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly alertCtrl = inject(AlertController);
    private readonly toastCtrl = inject(ToastController);

    public users: UserResponseDTO[] = [];


    ionViewWillEnter() {
        this.loadUsers();
    }

    async ngOnInit() {
        await this.loadUsers();
    }

    async loadUsers() {
        try {
            this.users = await this.dataMgmt.getAllUsers();
        } catch (error) {
            this.showToast('Error al cargar los usuarios', 'danger');
        }
    }

    async deleteUser(id: number) {
        const alert = await this.alertCtrl.create({
            header: 'Confirm Delete',
            message: '¿Do you want to delete this user? This action cannot be undone.',
            buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                    text: 'Delete',
                    role: 'destructive',
                    handler: async () => {
                        try {
                            await this.dataMgmt.deleteUser(id);
                            this.showToast('Usuario eliminado', 'success');
                            await this.loadUsers();
                        } catch (error) {
                            this.showToast('Error deleting user', 'danger');
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    editUser(user: UserResponseDTO) {
        this.nav.navigateForward(`/admin/edit-user/${user.id}`);
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }

    private async showToast(message: string, color: string) {
        const toast = await this.toastCtrl.create({ message, duration: 2000, color });
        await toast.present();
    }
}