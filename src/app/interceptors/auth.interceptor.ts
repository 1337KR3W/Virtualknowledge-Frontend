import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { environment } from '@env/environment'; // Importación limpia sin .prod
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const persistence = inject(PersistenceService);

    // 1. Obtenemos el token de la persistencia (Promesa -> Observable)
    return from(persistence.getValue('token')).pipe(
        switchMap(token => {
            let headers: { [name: string]: string } = {
                'X-API-KEY': environment.apiKey,
                'X-API-SECRET': environment.apiSecret
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const authReq = req.clone({
                setHeaders: headers
            });

            return next(authReq);
        })
    );
};