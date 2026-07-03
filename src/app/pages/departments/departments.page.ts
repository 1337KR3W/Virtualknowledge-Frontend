import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { DepartmentResponseDTO } from 'src/app/models/departmentDTO.model';
import { UserResponseDTO } from 'src/app/models/userDTO.model';

@Component({
    selector: 'app-departments',
    templateUrl: './departments.page.html',
    styleUrls: ['./departments.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class DepartmentsPage extends AbstractPage implements OnInit, OnDestroy {

    private readonly dataMgmt = inject(DataManagementService);

    public departments: DepartmentResponseDTO[] = [];
    public user: UserResponseDTO | null = null;

    async ngOnInit() {

        this.user = await this.dataMgmt.getValueFromStorage<UserResponseDTO>('userLogged');
        console.log('[DEPARTMENTS] Usuario recuperado:', this.user);
        await this.loadDepartments();
    }

    ionViewWillEnter() {
        this.dataMgmt.setBackButton(true);
    }

    async loadDepartments() {
        try {
            this.departments = await this.dataMgmt.getDepartments();
            console.log('[DEPARTMENTS] Departamentos cargados:', this.departments);
        } catch (error) {
            console.error('[DEPARTMENTS] Error al cargar los departamentos:', error);
            // Opcional: mostrar un toast aquí si tienes acceso al ToastController
        }
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }

    ngOnDestroy() {
        this.dataMgmt.setBackButton(false);
    }
}