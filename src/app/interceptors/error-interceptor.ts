/**
 * HTTP interceptor for global error handling.
 * Catches HTTP error responses, displays a user-facing toast alert,
 * and rethrows the error for further handling by callers.
 */
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  console.log(`[HTTP] ${req.method} ${req.url}`);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // Display error notification to the user
      toast.show(`Request failed (${err.status}): ${req.url}`, 'error');
      return throwError(() => err);
    })
  );
};
