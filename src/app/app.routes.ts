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
    loadComponent: () => import('./pages/projects/projects.page').then(m => m.ProjectsPage),
    canActivate: [authGuard]
  },
  {
    path: 'admin/register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'admin/create-department',
    loadComponent: () => import('./pages/departments/create-department.page').then(m => m.CreateDepartmentPage),
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' }
  },
  {
    path: 'admin/create-project',
    loadComponent: () => import('./pages/projects/create-project.page').then(m => m.CreateProjectPage),
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' }
  }
];
