/**
 * Listing service handling fetching, caching, creating, and retrieving property listings.
 */
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { StorageService } from './storage';
import { of } from 'rxjs/internal/observable/of';
import { tap } from 'rxjs/internal/operators/tap';
import { Observable } from 'rxjs/internal/Observable';
import { Listing } from '../models/listing';
import { map } from 'rxjs/internal/operators/map';

const KEY = 'listings';

@Service()
export class ListingService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  /**
   * Retrieves all listings from localStorage cache if available,
   * or loads default listings from 'data/listings.json' and populates the cache.
   *
   * @returns Observable stream emitting the list of properties.
   */
  getAll(): Observable<Listing[]> {
    const saved = this.storage.get<Listing[]>(KEY);
    if (saved) {
      return of(saved);
    }
    return this.http
      .get<Listing[]>('data/listings.json')
      .pipe(tap((data) => this.storage.set(KEY, data)));
  }

  /**
   * Adds a new property listing to storage, prepending it to the active list.
   *
   * @param listing - The new listing object to persist.
   * @returns Observable emitting the created listing.
   */
  add(listing: Listing): Observable<Listing> {
    return this.getAll().pipe(
      map((list) => {
        this.storage.set(KEY, [listing, ...list]);
        return listing;
      })
    );
  }

  /**
   * Retrieves a single listing by its unique identifier.
   *
   * @param id - The ID of the listing to find.
   * @returns Observable emitting the listing if found, or null otherwise.
   */
  getById(id: string): Observable<Listing | null> {
    return this.getAll().pipe(map((list) => list.find((l) => l.id === id) ?? null));
  }

  /**
   * Updates an existing listing in storage.
   *
   * @param updated - The updated listing object.
   * @returns Observable emitting the updated listing.
   */
  update(updated: Listing): Observable<Listing> {
    return this.getAll().pipe(
      map((list) => {
        const next = list.map((l) => (l.id === updated.id ? updated : l));
        this.storage.set(KEY, next);
        return updated;
      })
    );
  }

  /**
   * Deletes a listing by ID from storage.
   *
   * @param id - The ID of the listing to delete.
   * @returns Observable emitting true on success.
   */
  delete(id: string): Observable<boolean> {
    return this.getAll().pipe(
      map((list) => {
        const next = list.filter((l) => l.id !== id);
        this.storage.set(KEY, next);
        return true;
      })
    );
  }
}
