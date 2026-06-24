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
      {
        path: 'sso-portal',
        loadComponent: () =>
          import('./features/auth/pages/sso-portal/sso-portal.component').then(
            (m) => m.SsoPortalComponent,
          ),
      },
      {
        path: 'azure-ad',
        loadComponent: () =>
          import('./features/auth/pages/azure-ad/azure-ad.component').then((m) => m.AzureAdComponent),
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./features/auth/pages/privacy-policy/privacy-policy.component').then(
            (m) => m.PrivacyPolicyComponent,
          ),
      },
      {
        path: 'support-desk',
        loadComponent: () =>
          import('./features/auth/pages/support-desk/support-desk.component').then(
            (m) => m.SupportDeskComponent,
          ),
      },
      {
        path: 'terms-of-service',
        loadComponent: () =>
          import('./features/auth/pages/terms-of-service/terms-of-service.component').then(
            (m) => m.TermsOfServiceComponent,
          ),
      },
    ],
  },
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/courses/pages/courses-list/courses-list.component').then(
            (m) => m.CoursesListComponent,
          ),
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./features/courses/pages/course-detail/course-detail.component').then(
            (m) => m.CourseDetailComponent,
          ),
      },
      {
        path: 'instructors',
        loadComponent: () =>
          import('./features/instructors/pages/instructors-list/instructors-list.component').then(
            (m) => m.InstructorsListComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/pages/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'auth/sign-in' },
];
