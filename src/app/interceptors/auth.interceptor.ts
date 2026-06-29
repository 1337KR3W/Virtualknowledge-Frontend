import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const persistence = inject(PersistenceService);

    // 1. Si la petición va a la ruta de login/auth, la dejamos pasar intacta de inmediato
    if (req.url.includes('/auth/')) {
        console.log(`[Interceptor] Pasando de largo ruta pública: ${req.url}`);
        return next(req);
    }

    // 2. Para el resto de rutas protegidas, buscamos el token y lo inyectamos
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