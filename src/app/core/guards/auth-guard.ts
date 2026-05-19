import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const _router = inject(Router);
  const toastr = inject(ToastrService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    toastr.error('You must be logged in to access this page.', 'Access Denied');
    _router.navigate(['/login']);
    return false;
  }
};
