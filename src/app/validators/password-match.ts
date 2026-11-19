/**
 * Custom form group validator to ensure password and confirmPassword fields match.
 *
 * @param group - The abstract control group containing 'password' and 'confirmPassword' controls.
 * @returns A ValidationErrors object with `{ mismatch: true }` if they do not match, otherwise null.
 */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return password === confirm ? null : { mismatch: true };
}
