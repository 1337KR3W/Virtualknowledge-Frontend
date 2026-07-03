import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DataManagementService } from 'src/app/services/data-management.service';
import { AbstractPage } from '../abstract';

import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-edit-department',
    templateUrl: './edit-department.page.html',
    styleUrls: ['./edit-department.page.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})

export class EditDepartmentPage extends AbstractPage implements OnInit {
    private readonly dataMgmt = inject(DataManagementService);
    private readonly route = inject(ActivatedRoute);

    public deptId: string = '';
    public name: string = '';
    public userIds: number[] = [];
    public allUsers: any[] = [];

    async ngOnInit() {

        this.deptId = this.route.snapshot.paramMap.get('id')!;
        await this.loadDepartment();
        this.allUsers = await this.dataMgmt.getAllUsers();
    }

    async loadDepartment() {
        const dept = await this.dataMgmt.getDepartmentById(Number(this.deptId));
        this.name = dept.name;
        this.userIds = dept.userIds || [];
    }

    async saveChanges() {
        await this.dataMgmt.updateDepartment(Number(this.deptId), {
            name: this.name,
            userIds: this.userIds
        });
        this.goBack();
    }

    public goBack() {
        this.nav.navigateRoot('welcome', { animated: true, animationDirection: 'back' })
    }

    public compareWith(o1: any, o2: any) {
        return Number(o1) === Number(o2);
    }
}