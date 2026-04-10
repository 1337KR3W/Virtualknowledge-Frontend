import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DataManagementService } from '../services/data-management.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const dataMgmt = inject(DataManagementService);
    const router = inject(Router);

    const token = await dataMgmt.getToken();

    if (token) {
        return true;
    } else {
        //console.warn('[AuthGuard] Denied access: token not found.');
        router.navigate(['/login']);
        return false;
    }
};