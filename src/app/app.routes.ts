import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
  },

  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then(m => m.WelcomePage),
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects/projects.page').then(m => m.ProjectsPage),
    canActivate: [authGuard]
  },
];
