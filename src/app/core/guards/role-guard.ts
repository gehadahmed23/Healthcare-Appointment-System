import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';

export const roleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const expectedRoles = route.data?.['expectedRoles'] as string[];
  const userRole = authService.getRole();

  console.log(`${userRole} = ${expectedRoles}`);

  if (authService.isAuthenticated() && userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  return false;
};
