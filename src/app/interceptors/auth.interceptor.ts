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

            // 2. Definimos las cabeceras base (Identidad de Aplicación)
            // Estas se envían SIEMPRE, incluso en el login
            let headers: { [name: string]: string } = {
                'X-API-KEY': environment.apiKey,
                'X-API-SECRET': environment.apiSecret
            };

            // 3. Añadimos la identidad del usuario si el token existe (JWT)
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            // 4. Clonamos la petición con el set de cabeceras completo
            const authReq = req.clone({
                setHeaders: headers
            });

            // 5. Dejamos que la petición siga su curso
            return next(authReq);
        })
    );
};