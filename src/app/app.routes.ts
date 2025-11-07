import { Routes } from '@angular/router';

export const routes: Routes = [



    //Definicion de la ruta: /
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'

    },
    //Definicion de la ruta: home
    {
        path: 'home',
        loadComponent: () => import('./home/home').then(m => m.HomeComponent)
    },
    //Definicion de la ruta: login
    {
        path: 'login',
        loadComponent: () => import('./login/login').then(m => m.LoginComponent)
    },
    //Definicion de la ruta: register
    {
        path: 'register',
        loadComponent: () => import('./register/register').then(m => m.RegisterComponent)
    }
];
