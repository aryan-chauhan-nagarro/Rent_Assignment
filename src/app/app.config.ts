/**
 * Global application configuration.
 * Configures application-wide providers including routing, global error listening,
 * and HTTP client setup with custom interceptors.
 */
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error-interceptor';
import { headerInterceptor } from './interceptors/header-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Captures unhandled browser errors globally
    provideBrowserGlobalErrorListeners(),
    // Configures client-side routing with defined application routes
    provideRouter(routes),
    // Configures HTTP client with custom error handling and header interceptors
    provideHttpClient(withInterceptors([errorInterceptor, headerInterceptor])),
  ],
};
