import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { StorageService } from './storage';

describe('Auth Service', () => {
  let auth: Auth;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storage = TestBed.inject(StorageService);
    // Clear test storage to ensure isolation
    storage.remove('users');
    storage.remove('currentUser');
    auth = TestBed.inject(Auth);
  });

  it('should be created successfully', () => {
    expect(auth).toBeTruthy();
  });

  it('should register a new user successfully', () => {
    const result = auth.register('Test User', 'newuser@test.com', 'password123');
    expect(result.ok).toBe(true);
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.currentUser()?.email).toBe('newuser@test.com');
  });

  it('should prevent registration with a duplicate email', () => {
    auth.register('First User', 'duplicate@test.com', 'password123');
    const duplicateResult = auth.register('Second User', 'duplicate@test.com', 'password456');
    expect(duplicateResult.ok).toBe(false);
    expect(duplicateResult.message).toBe('Email already registered');
  });

  it('should login an existing user with correct credentials', () => {
    auth.register('Valid User', 'valid@test.com', 'mypassword');
    auth.logout();

    const loginResult = auth.login('valid@test.com', 'mypassword');
    expect(loginResult.ok).toBe(true);
    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.currentUser()?.name).toBe('Valid User');
  });

  it('should fail login when password is incorrect', () => {
    auth.register('Valid User', 'valid@test.com', 'mypassword');
    auth.logout();

    const loginResult = auth.login('valid@test.com', 'wrongpassword');
    expect(loginResult.ok).toBe(false);
    expect(loginResult.message).toBe('Invalid email or password');
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('should logout and clear current user session', () => {
    auth.register('Active User', 'active@test.com', 'password123');
    expect(auth.isLoggedIn()).toBe(true);

    auth.logout();
    expect(auth.isLoggedIn()).toBe(false);
    expect(auth.currentUser()).toBeNull();
  });
});
