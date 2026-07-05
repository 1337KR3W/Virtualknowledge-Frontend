import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { DataManagementService } from "../services/data-management.service";

export const authGuard: CanActivateFn = async (route, state) => {
    const dataMgmt = inject(DataManagementService);
    const router = inject(Router);

    const token = await dataMgmt.getToken();

    if (!token) {
        router.navigate(['/login']);
        return false;
    }

    const expectedRole = route.data['role'];

    if (expectedRole === 'ROLE_ADMIN') {
        const isAdmin = await dataMgmt.getValueFromStorage<boolean>('isAdmin');

        console.log('[AuthGuard] Validando acceso ADMIN. Valor en storage:', isAdmin);

        if (!isAdmin) {
            console.warn('[AuthGuard] Acceso denegado: Se requiere rol ADMIN');
            router.navigate(['/welcome']);
            return false;
        }
    }

    return true;
};