import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';
import { DepartmentResponseDTO } from 'src/app/models/departmentDTO.model';
import { UserResponseDTO } from 'src/app/models/userDTO.model';
import { BaseListComponent } from 'src/app/components/base/base-list.component';

@Component({
    selector: 'app-departments',
    templateUrl: './departments.page.html',
    styleUrls: ['./departments.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule, BaseListComponent]
})
export class DepartmentsPage extends AbstractPage implements OnInit, OnDestroy {

    private readonly dataMgmt = inject(DataManagementService);

    public department: DepartmentResponseDTO | null = null;
    public user: UserResponseDTO | null = null;

    async ngOnInit() {

        this.user = await this.dataMgmt.getValueFromStorage<UserResponseDTO>('userLogged');
        await this.loadDepartments();
    }

    ionViewWillEnter() {
        this.dataMgmt.setBackButton(true);
    }

    async loadDepartments() {
        try {
            this.department = await this.dataMgmt.getMyDepartment();
        } catch (error) {
            console.error('[DEPARTMENTS] Error al cargar el departamento:', error);
        }
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' });
    }

    ngOnDestroy() {
        this.dataMgmt.setBackButton(false);
    }
}