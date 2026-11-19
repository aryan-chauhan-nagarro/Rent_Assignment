import { TestBed } from '@angular/core/testing';
import { FavouriteService } from './favourite';
import { Auth } from './auth';
import { StorageService } from './storage';

describe('FavouriteService', () => {
  let service: FavouriteService;
  let auth: Auth;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
    storage.remove('favourites');
    storage.remove('currentUser');
    storage.remove('users');

    auth = TestBed.inject(Auth);
    service = TestBed.inject(FavouriteService);
  });

  it('should be created successfully', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty array when user is unauthenticated', () => {
    expect(service.ids()).toEqual([]);
  });

  it('should add a listing ID when toggled by authenticated user', () => {
    auth.register('Alice', 'alice@test.com', 'password123');

    service.toggle('listing-1');
    expect(service.ids()).toContain('listing-1');
    expect(service.ids().length).toBe(1);
  });

  it('should remove a listing ID when toggled a second time (toggle off)', () => {
    auth.register('Alice', 'alice@test.com', 'password123');

    service.toggle('listing-1');
    expect(service.ids()).toContain('listing-1');

    service.toggle('listing-1');
    expect(service.ids()).not.toContain('listing-1');
    expect(service.ids().length).toBe(0);
  });

  it('should maintain independent favourites per user account', () => {
    // User 1
    auth.register('User One', 'one@test.com', 'password123');
    service.toggle('listing-A');
    expect(service.ids()).toEqual(['listing-A']);

    // Switch to User 2
    auth.register('User Two', 'two@test.com', 'password123');
    expect(service.ids()).toEqual([]);
    service.toggle('listing-B');
    expect(service.ids()).toEqual(['listing-B']);

    // Log back in as User 1
    auth.login('one@test.com', 'password123');
    expect(service.ids()).toEqual(['listing-A']);
  });
});
