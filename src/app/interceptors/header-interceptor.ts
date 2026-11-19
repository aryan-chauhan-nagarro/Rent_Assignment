/**
 * HTTP interceptor for request headers.
 * Appends application identifying metadata headers (e.g., 'X-App') to all outgoing HTTP requests.
 */
import { HttpInterceptorFn } from '@angular/common/http';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);

  // Clone outgoing request and attach custom app identification headers
  const modified = req.clone({
    setHeaders: { 'X-App': 'RentHub' },
  });

  return next(modified);
};
