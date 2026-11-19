/**
 * Registration page component.
 * Registers new users with name, email, and confirmed password.
 */
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { passwordsMatch } from '../../validators/password-match';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);

  /** Signal holding any registration error message to display */
  errorMessage = signal('');

  /** Reactive form with cross-field password matching validator */
  form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    {
      validators: passwordsMatch,
    }
  );

  /**
   * Submits registration form data to create a new user account.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.form.getRawValue();

    const result = this.auth.register(name, email, password);

    if (result.ok) {
      this.router.navigate(['/']);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
