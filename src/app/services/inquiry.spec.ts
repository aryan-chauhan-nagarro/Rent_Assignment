import { TestBed } from '@angular/core/testing';
import { InquiryService } from './inquiry';
import { Auth } from './auth';
import { StorageService } from './storage';
import { Listing } from '../models/listing';

describe('InquiryService', () => {
  let service: InquiryService;
  let auth: Auth;
  let storage: StorageService;

  const mockListing: Listing = {
    id: 'prop-1',
    ownerId: 'owner-101',
    ownerName: 'Landlord Sharma',
    title: 'Sunny Studio',
    description: 'Cozy place',
    address: '10 Civil Lines',
    squareFeet: 450,
    rent: 800,
    negotiable: false,
    leaseType: 'short',
    furnished: true,
    vegetarianPreference: 'any',
    shared: false,
    amenities: [],
    photos: [],
    featured: false,
    createdAt: '2026-11-01T00:00:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
    storage.remove('inquiries');
    storage.remove('currentUser');
    storage.remove('users');

    auth = TestBed.inject(Auth);
    service = TestBed.inject(InquiryService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should reject sending inquiry when no user is logged in', () => {
    const success = service.send(mockListing, 'Is this still open?');
    expect(success).toBe(false);
  });

  it('should successfully store an inquiry when sender is logged in', () => {
    auth.register('Renter Bob', 'bob@example.com', 'password123');

    const success = service.send(mockListing, 'Can I visit tomorrow?');
    expect(success).toBe(true);

    const inquiries = service.inquiries();
    expect(inquiries.length).toBeGreaterThanOrEqual(1);

    const sent = inquiries.find((i) => i.message === 'Can I visit tomorrow?');
    expect(sent).toBeDefined();
    expect(sent?.ownerId).toBe('owner-101');
    expect(sent?.fromName).toBe('Renter Bob');
    expect(sent?.fromUserEmail).toBe('bob@example.com');
  });

  it('should correctly compute receivedCount for property owner', () => {
    // Log in as Bob and send inquiry to owner-101
    auth.register('Bob', 'bob@example.com', 'password123');
    service.send(mockListing, 'First inquiry');

    // Switch to owner-101
    auth.register('Landlord Sharma', 'owner@example.com', 'password123');
    // Set owner's ID to owner-101 to match listing
    const current = auth.currentUser()!;
    auth.currentUser.set({ ...current, id: 'owner-101' });

    expect(service.receivedCount()).toBe(1);
  });

  it('should delete an inquiry by ID', () => {
    auth.register('Bob', 'bob@example.com', 'password123');
    service.send(mockListing, 'Inquiry to delete');

    const inq = service.inquiries().find((i) => i.message === 'Inquiry to delete')!;
    expect(inq).toBeDefined();

    service.delete(inq.id);
    expect(service.inquiries().some((i) => i.id === inq.id)).toBe(false);
  });
});
