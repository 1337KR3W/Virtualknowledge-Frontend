import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from 'src/app/pages/abstract';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage extends AbstractPage {
    private readonly dataMgmt = inject(DataManagementService);

    // Modelo del formulario
    public userData = {
        name: '',
        email: '',
        password: '',
        role: 'ROLE_USER' // Valor por defecto
    };

    async onRegister() {
        try {
            await this.dataMgmt.createNewUser(this.userData);
            // Si todo va bien, mostramos mensaje y volvemos atrás
            console.log('Usuario creado con éxito');
            this.nav.back();
        } catch (error) {
            console.error('Error al registrar usuario', error);
            // Aquí podrías añadir una alerta de Ionic para el usuario
        }
    }
}