/**
 * Root component of the application.
 * Provides the global navigation bar, router outlet for views, and toast notification container.
 */
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from './services/auth';
import { InquiryService } from './services/inquiry';
import { ToastContainer } from './components/toast-container/toast-container';

@Component({
  imports: [RouterOutlet, RouterLink, ToastContainer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);
  auth = inject(Auth);
  inquiryService = inject(InquiryService);

  /**
   * Logs out the current user and navigates to the login page.
   */
  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
