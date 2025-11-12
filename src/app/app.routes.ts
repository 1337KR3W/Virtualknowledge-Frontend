/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { LoginComponent } from './components/login/login';
import { WelcomeComponent } from './components/welcome/welcome';
import { RegisterComponent } from './components/register/register';
import { HomeComponent } from './components/home/home';
import { UsersComponent } from './components/users/users';
import { UserDetails } from './components/user-details/user-details';

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
        canActivate: [authGuard],
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

    //Definicion de la ruta: users
    {
        path: 'users',
        component: UsersComponent
    },
    //Definicion de la ruta: users/id
    {
        path: 'users/:id',
        component: UserDetails
    },
    // Manejo de 404 (opcional, redirige a la raíz)
    {
        path: '**',
        redirectTo: ''
    }
];

/*
   __          _______ __________ _____  _____      __
  / /  __ __  <  /_  /|_  /_  / //_/ _ \|_  / | /| / /
 / _ \/ // /  / //_ <_/_ < / / ,< / , _//_ <| |/ |/ / 
/_.__/\_, /  /_/____/____//_/_/|_/_/|_/____/|__/|__/  
     /___/                                            
*/
