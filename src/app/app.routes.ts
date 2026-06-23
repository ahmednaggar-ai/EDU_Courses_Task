import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/sign-in', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
      {
        path: 'sign-in',
        loadComponent: () =>
          import('./features/auth/pages/sign-in/sign-in.component').then((m) => m.SignInComponent),
      },
      {
        path: 'sign-up',
        loadComponent: () =>
          import('./features/auth/pages/sign-up/sign-up.component').then((m) => m.SignUpComponent),
      },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/courses/pages/courses-list/courses-list.component').then(
            (m) => m.CoursesListComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/sign-in' },
];
