/**
 * Route guard that protects authenticated routes.
 * Allows navigation if a user is logged in; otherwise redirects to the login page
 * while preserving the attempted URL in query parameters.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Allow access if the user is authenticated
  if (auth.isLoggedIn()) {
    return true;
  }

  // Redirect to login and keep track of return URL
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
