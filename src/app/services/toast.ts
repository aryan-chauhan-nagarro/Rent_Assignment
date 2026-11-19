/**
 * Notification service providing ephemeral toast messages across the application.
 */
import { Service } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Toast notification payload structure.
 */
export interface Toast {
  /** Unique sequential identifier */
  id: number;
  /** Notification message text */
  message: string;
  /** Toast styling visual category */
  type: 'success' | 'error' | 'info';
}

@Service()
export class ToastService {
  private nextId = 1;
  private readonly _toasts = new BehaviorSubject<Toast[]>([]);

  /** Observable stream of currently active toast notifications */
  readonly toasts$ = this._toasts.asObservable();

  /**
   * Displays a new toast notification that automatically dismisses after the given duration.
   *
   * @param message - The message string to display.
   * @param type - Category style ('success' | 'error' | 'info').
   * @param duration - Time in milliseconds before the toast auto-dismisses (defaults to 3000ms).
   */
  show(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const toast: Toast = { id: this.nextId++, message, type };
    this._toasts.next([...this._toasts.value, toast]);
    setTimeout(() => this.dismiss(toast.id), duration);
  }

  /**
   * Dismisses and removes an active toast by its unique identifier.
   *
   * @param id - The numeric ID of the toast to dismiss.
   */
  dismiss(id: number): void {
    this._toasts.next(this._toasts.value.filter((t) => t.id !== id));
  }
}
