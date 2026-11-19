/**
 * Custom form control validator to ensure text input is not only whitespace.
 *
 * @param control - The abstract control being validated.
 * @returns A ValidationErrors object with `{ blank: true }` if input is empty/whitespace, otherwise null.
 */
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function notBlank(control: AbstractControl): ValidationErrors | null {
  const val = control.value;
  if (typeof val === 'string' && val.trim() === '') {
    return { blank: true };
  }
  return null;
}
