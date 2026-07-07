import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { PersistenceService } from '../services/persistence.service';
import { RestService } from '../services/rest.service';
import { BehaviorSubject, from, throwError, switchMap, filter, take, catchError, Observable } from 'rxjs';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const persistence = inject(PersistenceService);
    const rest = inject(RestService);

    if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
        return next(req);
    }

    return from(persistence.getValue('token')).pipe(
        switchMap(token => {
            const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        return handle401Error(req, next, persistence, rest);
                    }
                    return throwError(() => error);
                })
            );
        })
    );
};

function handle401Error(req: HttpRequest<unknown>, next: HttpHandlerFn, persistence: any, rest: any): Observable<HttpEvent<unknown>> {
    if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);

        return from(persistence.getValue('refreshToken')).pipe(
            switchMap(rToken => {
                if (!rToken) return throwError(() => new Error('No refresh token'));

                return from(rest.refreshToken(rToken)).pipe(
                    switchMap((res: any) => {
                        isRefreshing = false;
                        persistence.setValue('token', res.token);
                        refreshTokenSubject.next(res.token);

                        const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
                        return next(newReq);
                    }),
                    catchError(err => {
                        isRefreshing = false;
                        refreshTokenSubject.next(null);
                        return throwError(() => err);
                    })
                );
            })
        );
    }

    return refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap(token => {
            const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            return next(newReq);
        })
    );
}