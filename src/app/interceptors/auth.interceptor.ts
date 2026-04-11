import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { environment } from '@env/environment';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const persistence = inject(PersistenceService);

    return from(persistence.getValue('token')).pipe(
        switchMap(token => {
            console.log(`[Interceptor] Path: ${req.url} | Token presente: ${!!token}`);

            const headers: any = {
                'X-API-KEY': environment.apiKey,
                'X-API-SECRET': environment.apiSecret
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const authReq = req.clone({ setHeaders: headers });
            return next(authReq);
        })
    );
};