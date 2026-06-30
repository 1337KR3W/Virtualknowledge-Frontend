import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const persistence = inject(PersistenceService);
    const utils = inject(UtilsService);

    return from(persistence.getValue('token')).pipe(
        switchMap(token => {
            console.log(`[Interceptor] Path: ${req.url} | JWT presente: ${!!token}`);

            let authReq = req;

            if (token) {
                authReq = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }
            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        const errorMessage = error.error?.message || 'Credenciales inválidas';
                        utils.showToast(errorMessage, 'danger');
                    } else if (error.status === 400) {
                        utils.showToast(error.error?.details || 'Error en la petición', 'warning');
                    }
                    return throwError(() => error);
                })
            );
        })
    );
};