import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

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
    path: 'departments',
    loadComponent: () => import('./pages/departments/departments.page').then(m => m.DepartmentsPage),
    canActivate: [authGuard]
  },

  {
    path: 'admin',
    canActivate: [authGuard],
    data: { role: 'ROLE_ADMIN' },
    children: [
      { path: 'manage-projects', loadComponent: () => import('./pages/projects/manage-projects.page').then(m => m.ManageProjectsPage) },
      { path: 'create-project', loadComponent: () => import('./pages/projects/create-project.page').then(m => m.CreateProjectPage) },
      { path: 'edit-project/:id', loadComponent: () => import('./pages/projects/edit-project.page').then(m => m.EditProjectPage) },

      { path: 'manage-departments', loadComponent: () => import('./pages/departments/manage-departments.page').then(m => m.ManageDepartmentsPage) },
      { path: 'create-department', loadComponent: () => import('./pages/departments/create-department.page').then(m => m.CreateDepartmentPage) },
      { path: 'edit-department/:id', loadComponent: () => import('./pages/departments/edit-department.page').then(m => m.EditDepartmentPage) },

      { path: 'register', loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage) },
      { path: 'manage-users', loadComponent: () => import('./pages/register/manage-users.page').then(m => m.ManageUsersPage) },
      { path: 'edit-user/:id', loadComponent: () => import('./pages/register/edit-user.page').then(m => m.EditUserPage) },
    ]
  }
];