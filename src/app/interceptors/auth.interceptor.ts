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

                    } else if (error.status === 400) {

                    }
                    return throwError(() => error);
                })
            );
        })
    );
};