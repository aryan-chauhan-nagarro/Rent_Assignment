/**
 * Component for rendering application toast notifications.
 * Subscribes to the ToastService stream and renders active toasts with dismiss controls.
 */
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  private toastService = inject(ToastService);

  /** Signal of currently active toast messages derived from ToastService stream */
  toasts = toSignal(this.toastService.toasts$, { requireSync: true });

  /**
   * Manually dismisses a toast message by its ID.
   *
   * @param id - The ID of the toast to dismiss.
   */
  dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
