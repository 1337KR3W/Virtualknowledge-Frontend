import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from 'src/app/pages/abstract';
import { UserRequestDTO } from 'src/app/models/userDTO.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly toastCtrl = inject(ToastController);
    public departments: any[] = [];


    public newUser: UserRequestDTO = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        departmentId: 1,
        roleId: 1,
        status: 'ACTIVE'
    };

    async ngOnInit() {
        try {
            this.departments = await this.dataMgmt.getDepartments();
        } catch (error) {
            console.error('Error loading departments', error);
            this.showToast('Error loading departments', 'danger');
        }
    }

    async onRegister() {
        if (!this.newUser.email || !this.newUser.password) {
            this.showToast('Email and password are required', 'warning');
            return;
        }

        try {
            await this.dataMgmt.createNewUser(this.newUser);
            this.showToast('User registered successfully', 'success');
            this.nav.back();
        } catch (error: any) {
            const errorMessage = (error.error && error.error.details)
                ? error.error.details
                : 'Unexpected error occurred while creating new user';

            this.showToast(errorMessage, 'danger');
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