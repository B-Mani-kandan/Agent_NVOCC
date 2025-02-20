import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { JobNvoccComponent } from './components/pages/job-nvocc/job-nvocc.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'nvocc-booking',
        component: JobNvoccComponent,
      },
    ],
  },
];
