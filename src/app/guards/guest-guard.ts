/**
 * Route guard for guest-only routes (e.g., login, register).
 * Allows access only when no user is currently authenticated;
 * redirects logged-in users back to the home page.
 */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  // Allow access only if visitor is not logged in
  if (!auth.isLoggedIn()) {
    return true;
  }

  // Redirect authenticated users to home
  return router.createUrlTree(['/']);
};
