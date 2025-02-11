import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
export const authGuard: CanActivateFn = (route, state) => {
  debugger;
  const router = inject(Router);
  const loggedData = localStorage.getItem('authToken');
  if (loggedData && loggedData.trim() !== '') {
    return true;
  } else {
    router.navigateByUrl('login');
    return false;
  }
};
