/**
 * Authentication service managing user registration, login, logout,
 * and current session state with localStorage persistence.
 */
import { computed, inject, Service, signal } from '@angular/core';
import { StorageService } from './storage';
import { User } from '../models/user';

export const DEMO_USERS: User[] = [
  {
    id: 'landlord-1',
    name: 'Rajesh Sharma (Landlord)',
    email: 'landlord@example.com',
    password: 'password123',
  },
  {
    id: 'renter-1',
    name: 'Priya Patel (Renter)',
    email: 'renter@example.com',
    password: 'password123',
  },
];

@Service()
export class Auth {
  private storage = inject(StorageService);

  constructor() {
    this.seedDemoUsers();
  }

  /**
   * Initializes demo credentials in localStorage if not already present.
   */
  private seedDemoUsers(): void {
    const existing = this.storage.get<User[]>('users') ?? [];
    let updated = false;
    for (const demo of DEMO_USERS) {
      if (!existing.some((u) => u.email.toLowerCase() === demo.email.toLowerCase())) {
        existing.push(demo);
        updated = true;
      }
    }
    if (updated || !this.storage.get<User[]>('users')) {
      this.storage.set('users', existing);
    }
  }

  /** Signal holding the currently authenticated user, or null if unauthenticated */
  currentUser = signal<User | null>(this.storage.get<User>('currentUser'));

  /** Reactive boolean indicating whether a user is currently logged in */
  isLoggedIn = computed(() => this.currentUser() !== null);

  /**
   * Registers a new user account if the email is not already taken.
   *
   * @param name - Display name of the user.
   * @param email - Unique email address.
   * @param password - Account password.
   * @returns An object with success status `ok` and status `message`.
   */
  register(name: string, email: string, password: string): { ok: boolean; message: string } {
    const users = this.storage.get<User[]>('users') ?? [];

    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, message: 'Email already registered' };
    }

    const newUser: User = { id: crypto.randomUUID(), name, email, password };
    this.storage.set('users', [...users, newUser]);
    this.setSession(newUser);
    return { ok: true, message: 'Registered successfully' };
  }

  /**
   * Validates user credentials and initiates a session upon success.
   *
   * @param email - User's email address.
   * @param password - User's password.
   * @returns An object with success status `ok` and status `message`.
   */
  login(email: string, password: string): { ok: boolean; message: string } {
    const users = this.storage.get<User[]>('users') ?? [];
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { ok: false, message: 'Invalid email or password' };
    }
    this.setSession(user);
    return { ok: true, message: 'Logged in' };
  }

  /**
   * Clears the current user session and removes persisted auth data from storage.
   */
  logout(): void {
    this.currentUser.set(null);
    this.storage.remove('currentUser');
  }

  /**
   * Updates state signals and stores session data in persistent storage.
   *
   * @param user - Authenticated user instance.
   */
  private setSession(user: User): void {
    this.currentUser.set(user);
    this.storage.set('currentUser', user);
  }
}
