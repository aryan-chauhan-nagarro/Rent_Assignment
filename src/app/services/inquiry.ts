/**
 * Inquiry service managing messages sent by prospective tenants to property owners.
 */
import { Service, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage';
import { Auth } from './auth';
import { Listing } from '../models/listing';
import { Inquiry } from '../models/inquiry';

const KEY = 'inquiries';

const DEFAULT_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-seed-1',
    listingId: 'l1',
    listingTitle: 'Sunny 2BHK near Metro',
    ownerId: 'landlord-1',
    fromUserId: 'renter-1',
    fromName: 'Priya Patel (Renter)',
    fromUserEmail: 'renter@example.com',
    message: 'Hello! Is this apartment available for move-in next month? Also, is parking included in the monthly rent?',
    createdAt: '2026-11-15T14:30:00.000Z',
  },
];

@Service()
export class InquiryService {
  private storage = inject(StorageService);
  private auth = inject(Auth);

  /** Internal reactive signal storing all inquiries */
  private all = signal<Inquiry[]>(this.getInitialInquiries());

  /** Read-only signal exposure of all inquiries */
  readonly inquiries = this.all.asReadonly();

  /** Count of received inquiries for the logged-in user */
  readonly receivedCount = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return 0;
    return this.all().filter((i) => i.ownerId === user.id).length;
  });

  /**
   * Initializes inquiries from storage, seeding a default inquiry if none exist.
   */
  private getInitialInquiries(): Inquiry[] {
    const saved = this.storage.get<Inquiry[]>(KEY);
    if (saved && saved.length > 0) {
      return saved;
    }
    this.storage.set(KEY, DEFAULT_INQUIRIES);
    return DEFAULT_INQUIRIES;
  }

  /**
   * Creates and stores an inquiry message for a specific property listing.
   *
   * @param listing - The property listing being inquired about.
   * @param message - The text content of the user's message.
   * @returns Boolean indicating whether the inquiry was successfully stored.
   */
  send(listing: Listing, message: string): boolean {
    const user = this.auth.currentUser();
    if (!user) {
      return false;
    }
    const inquiry: Inquiry = {
      id: crypto.randomUUID(),
      listingId: listing.id,
      listingTitle: listing.title,
      ownerId: listing.ownerId,
      fromUserId: user.id,
      fromName: user.name,
      fromUserEmail: user.email,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    this.all.update((list) => [inquiry, ...list]);
    this.storage.set(KEY, this.all());
    return true;
  }

  /**
   * Deletes an inquiry by ID.
   *
   * @param id - The ID of the inquiry to delete.
   */
  delete(id: string): void {
    this.all.update((list) => list.filter((i) => i.id !== id));
    this.storage.set(KEY, this.all());
  }
}
