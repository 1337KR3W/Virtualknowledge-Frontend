import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';
import { WelcomeComponent } from './components/welcome/welcome';
import { RegisterComponent } from './components/register/register';
import { HomeComponent } from './components/home/home';

export const routes: Routes = [

    //Para cargar componentes de manera alternativa
    //loadComponent: () => import('./components/welcome/welcome').then(m => m.WelcomeComponent),

    //Definicion de la ruta: /
    {
        path: '',
        component: WelcomeComponent
    },
    //Definicion de la ruta: home
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [authGuard]
    },
    //Definicion de la ruta: login
    {
        path: 'login',
        component: LoginComponent
    },
    //Definicion de la ruta: register
    {
        path: 'register',
        component: RegisterComponent
    },
    // Manejo de 404 (opcional, redirige a la raíz)
    {
        path: '**',
        redirectTo: ''
    }
];
