// import { Routes } from '@angular/router';
// import { LoginComponent } from './components/login/login/login.component';
// import { LayoutComponent } from './components/layout/layout/layout.component';
// import { authGuard } from './guard/auth.guard';
// import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
// import { JobNvoccComponent } from './components/pages/job-nvocc/job-nvocc.component';

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full',
//   },
//   {
//     path: 'login',
//     component: LoginComponent,
//     pathMatch: 'full',
//   },
//   {
//     path: '',
//     component: SidebarComponent,
//     canActivate: [authGuard],
//   },
//   {
//     path: 'dashboard',
//     component: SidebarComponent,
//     canActivate: [authGuard],
//   },
//   {
//     path: 'nvocc-booking',
//     component: JobNvoccComponent,
//     canActivate: [authGuard],
//     pathMatch: 'full',
//   },
// ];

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { JobNvoccComponent } from './components/pages/job-nvocc/job-nvocc.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
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
