import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from 'src/app/pages/abstract';
import { UserDTO } from 'src/app/models/userDTO.model';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage extends AbstractPage {
    private readonly dataMgmt = inject(DataManagementService);
    public newUser = new UserDTO();

    constructor() {
        super();
        this.newUser.firstName = '';
        this.newUser.lastName = '';
        this.newUser.email = '';
        this.newUser.password = '';
        this.newUser.roles = ['USER'];
        this.newUser.status = 'ACTIVE';
        this.newUser.projects = [];
    }

    async onRegister() {
        try {
            await this.dataMgmt.createNewUser(this.newUser);

            console.log('Usuario creado con éxito');
            this.nav.back();
        } catch (error) {
            console.error('Error al registrar usuario', error);

        }
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' })
    }
}