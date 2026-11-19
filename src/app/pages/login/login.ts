/**
 * Login page component.
 * Authenticates users using email and password, handling validation and post-login redirection.
 */
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  /** Signal holding any authentication error message to present to the user */
  errorMessage = signal('');

  /** Reactive form for user login */
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Pre-fills the login form with ready-to-test demo credentials.
   */
  fillDemo(role: 'landlord' | 'renter'): void {
    if (role === 'landlord') {
      this.form.setValue({ email: 'landlord@example.com', password: 'password123' });
    } else {
      this.form.setValue({ email: 'renter@example.com', password: 'password123' });
    }
  }

  /**
   * Submits user credentials for authentication.
   * If successful, navigates to the returnUrl or home page.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password } = this.form.getRawValue();
    const result = this.auth.login(email, password);

    if (result.ok) {
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      this.router.navigateByUrl(returnUrl ?? '/');
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
