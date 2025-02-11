import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login/login.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { authGuard } from './guard/auth.guard';

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
    component: LayoutComponent,
    canActivate: [authGuard],
  },
];
