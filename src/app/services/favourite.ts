/**
 * Favourite service managing user-specific saved/favorited property listings.
 * Stores favorites per user in localStorage.
 */
import { Service, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage';
import { Auth } from './auth';

@Service()
export class FavouriteService {
  private storage = inject(StorageService);
  private auth = inject(Auth);

  /** Internal map of userId -> array of favorite listing IDs */
  private all = signal<Record<string, string[]>>(
    this.storage.get<Record<string, string[]>>('favourites') ?? {}
  );

  /** Signal of favorite listing IDs for the currently logged-in user */
  ids = computed(() => {
    const user = this.auth.currentUser();
    return user ? (this.all()[user.id] ?? []) : [];
  });

  /**
   * Toggles a listing ID in the active user's favorites list.
   *
   * @param listingId - The ID of the listing to add or remove.
   */
  toggle(listingId: string): void {
    const user = this.auth.currentUser();
    if (!user) {
      return;
    }

    const current = this.ids();
    const newList = current.includes(listingId)
      ? current.filter((id) => id !== listingId)
      : [...current, listingId];

    this.all.update((map) => ({ ...map, [user.id]: newList }));
    this.storage.set('favourites', this.all());
  }
}
