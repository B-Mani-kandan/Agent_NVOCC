import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { JobNvoccComponent } from './components/pages/job-nvocc/job-nvocc.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { ExportSeaPlanningComponent } from './components/pages/export-sea-planning/export-sea-planning.component';
import { ImportSeaPlanningComponent } from './components/pages/import-sea-planning/import-sea-planning.component';
import { ContainerBookingComponent } from './components/pages/container-booking/container-booking.component';
import { EmptyReturnComponent } from './components/pages/empty-return/empty-return.component';

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
        path: 'export-sea-planning',
        component: ExportSeaPlanningComponent,
      },
      {
        path: 'import-sea-planning',
        component: ImportSeaPlanningComponent,
      },
      {
        path: 'container-booking',
        component: ContainerBookingComponent,
      },
      {
        path: 'nvocc-booking',
        component: JobNvoccComponent,
      },
      {
        path: 'empty-return',
        component: EmptyReturnComponent,
      },
    ],
  },
];
