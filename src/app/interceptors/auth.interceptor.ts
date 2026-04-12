import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const persistence = inject(PersistenceService);

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
            return next(authReq);
        })
    );
};