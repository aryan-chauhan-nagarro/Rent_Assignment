/**
 * Inquiries management page component.
 * Allows users to view inquiries received for their listings (as landlords)
 * and inquiries they have sent (as prospective renters).
 */
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { InquiryService } from '../../services/inquiry';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-inquiries',
  imports: [RouterLink, DatePipe],
  templateUrl: './inquiries.html',
  styleUrl: './inquiries.css',
})
export class Inquiries {
  private inquiryService = inject(InquiryService);
  private toast = inject(ToastService);
  auth = inject(Auth);

  /** Active view tab: 'received' (as owner) or 'sent' (as prospective tenant) */
  activeTab = signal<'received' | 'sent'>('received');

  /** Inquiries received for properties owned by the current user */
  receivedInquiries = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.inquiryService.inquiries().filter((i) => i.ownerId === user.id);
  });

  /** Inquiries sent by the current user to other property owners */
  sentInquiries = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.inquiryService.inquiries().filter((i) => i.fromUserId === user.id);
  });

  /** Switch active tab */
  setTab(tab: 'received' | 'sent'): void {
    this.activeTab.set(tab);
  }

  /** Delete or dismiss an inquiry */
  deleteInquiry(id: string): void {
    this.inquiryService.delete(id);
    this.toast.show('Inquiry removed', 'info');
  }
}
