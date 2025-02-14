import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guard/auth.guard';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';

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
    path: 'layout',
    component: SidebarComponent,
    canActivate: [authGuard],
  },
  {
    path: 'side',
    component: SidebarComponent,
    canActivate: [authGuard],
  },
];
