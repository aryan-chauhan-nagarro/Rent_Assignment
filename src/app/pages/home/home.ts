/**
 * Home page component.
 * Features a featured listing carousel, full-text search, price/amenities/food filtering,
 * sorting, pagination, and favorites toggle.
 */
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ListingCard } from '../../components/listing-card/listing-card';
import { ListingService } from '../../services/listing';
import { FavouriteService } from '../../services/favourite';
import { Auth } from '../../services/auth';
import { AMENITIES } from '../../constants/amenities';

type SortOption = 'newest' | 'priceAsc' | 'priceDesc';

@Component({
  selector: 'app-home',
  imports: [ListingCard, RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private listingService = inject(ListingService);
  private favourites = inject(FavouriteService);
  auth = inject(Auth);
  private router = inject(Router);

  /** Number of listings to display per page */
  readonly pageSize = 6;
  /** Full list of available amenities for filtering */
  readonly allAmenities = AMENITIES;

  /** All listings fetched via ListingService, stored as a signal */
  listings = toSignal(this.listingService.getAll(), { initialValue: [] });

  // Input filter signals controlled by user interactions
  /** Search term for title and address */
  search = signal('');
  /** Maximum price threshold filter */
  maxPrice = signal<number | null>(null);
  /** Filter to show only furnished properties */
  furnishedOnly = signal(false);
  /** Dietary / food preference filter */
  vegPreference = signal<'all' | 'veg' | 'non-veg'>('all');
  /** Filter to show only current user's listings */
  onlyMine = signal(false);
  /** Filter to show only favourited listings */
  onlyFavourites = signal(false);
  /** Set of amenity names that must all be present on the listing */
  selectedAmenities = signal<string[]>([]);
  /** Active sort order criteria */
  sortBy = signal<SortOption>('newest');
  /** Current page index (1-based) */
  page = signal(1);

  // Derived signals
  /** Listings matching all active search and filter criteria */
  filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    const max = this.maxPrice();
    const furnished = this.furnishedOnly();
    const veg = this.vegPreference();
    const mine = this.onlyMine();
    const favs = this.onlyFavourites();
    const amenities = this.selectedAmenities();
    const currentUserId = this.auth.currentUser()?.id;
    const favIds = this.favourites.ids();

    return this.listings().filter((l) => {
      const matchesSearch = !q || l.title.toLowerCase().includes(q) || l.address.toLowerCase().includes(q);
      const matchesMaxRent = max === null || l.rent <= max;
      const matchesFurnished = !furnished || l.furnished;
      const matchesVeg = veg === 'all' || l.vegetarianPreference === veg;
      const matchesMine = !mine || (!!currentUserId && l.ownerId === currentUserId);
      const matchesFavs = !favs || favIds.includes(l.id);
      const matchesAmenities = amenities.every((a) => l.amenities.includes(a));

      return (
        matchesSearch &&
        matchesMaxRent &&
        matchesFurnished &&
        matchesVeg &&
        matchesMine &&
        matchesFavs &&
        matchesAmenities
      );
    });
  });

  /** Filtered listings sorted according to selected sort criteria */
  sorted = computed(() => {
    const list = [...this.filtered()];
    switch (this.sortBy()) {
      case 'priceAsc':
        return list.sort((a, b) => a.rent - b.rent);
      case 'priceDesc':
        return list.sort((a, b) => b.rent - a.rent);
      default:
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
  });

  /** Total number of pagination pages */
  totalPages = computed(() => Math.max(1, Math.ceil(this.sorted().length / this.pageSize)));
  /** Page numbers array for pagination buttons */
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  /** Slice of listings corresponding to the current active page */
  paged = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.sorted().slice(start, start + this.pageSize);
  });

  // Featured listings carousel
  /** Listings flagged as featured */
  featured = computed(() => this.listings().filter((l) => l.featured));
  /** Active index of the featured carousel slide */
  slideIndex = signal(0);
  /** Currently active slide listing */
  currentSlide = computed(() => this.featured()[this.slideIndex()] ?? null);

  constructor() {
    // Automatically advance featured carousel slide every 5 seconds
    const id = setInterval(() => this.next(), 5000);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
  }

  /**
   * Advances carousel to the next slide.
   */
  next(): void {
    const n = this.featured().length;
    if (n) this.slideIndex.update((i) => (i + 1) % n);
  }

  /**
   * Moves carousel to the previous slide.
   */
  prev(): void {
    const n = this.featured().length;
    if (n) this.slideIndex.update((i) => (i - 1 + n) % n);
  }

  // Event handlers for filtering and sorting
  /**
   * Handles text search input changes and resets pagination to page 1.
   */
  onSearch(e: Event): void {
    this.search.set((e.target as HTMLInputElement).value);
    this.page.set(1);
  }

  /**
   * Handles max price filter input changes.
   */
  onMaxPrice(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.maxPrice.set(value === '' ? null : Number(value));
    this.page.set(1);
  }

  /**
   * Handles toggle for furnished-only filter checkbox.
   */
  onFurnished(e: Event): void {
    this.furnishedOnly.set((e.target as HTMLInputElement).checked);
    this.page.set(1);
  }

  /**
   * Handles food/vegetarian preference filter change.
   */
  onVegPreference(pref: 'all' | 'veg' | 'non-veg'): void {
    this.vegPreference.set(pref);
    this.page.set(1);
  }

  /**
   * Toggles showing only the active user's listings.
   */
  toggleOnlyMine(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.onlyMine.update((v) => !v);
    this.page.set(1);
  }

  /**
   * Toggles showing only the active user's favorited listings.
   */
  toggleOnlyFavourites(): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.onlyFavourites.update((v) => !v);
    this.page.set(1);
  }

  /**
   * Toggles inclusion of a particular amenity in the filter list.
   */
  onAmenity(amenity: string): void {
    this.selectedAmenities.update((list) =>
      list.includes(amenity) ? list.filter((a) => a !== amenity) : [...list, amenity]
    );
    this.page.set(1);
  }

  /**
   * Updates sort ordering and resets pagination to page 1.
   */
  onSort(e: Event): void {
    this.sortBy.set((e.target as HTMLSelectElement).value as SortOption);
    this.page.set(1);
  }

  /**
   * Resets all search queries, price filters, and checkboxes back to defaults.
   */
  clearFilters(): void {
    this.search.set('');
    this.maxPrice.set(null);
    this.furnishedOnly.set(false);
    this.vegPreference.set('all');
    this.onlyMine.set(false);
    this.onlyFavourites.set(false);
    this.selectedAmenities.set([]);
    this.sortBy.set('newest');
    this.page.set(1);
  }

  /**
   * Navigates to a specific page number.
   *
   * @param p - Target page number.
   */
  goTo(p: number): void {
    this.page.set(p);
  }

  /**
   * Checks if a listing is currently favorited by the logged-in user.
   */
  isFavourite(id: string): boolean {
    return this.favourites.ids().includes(id);
  }

  /**
   * Toggles the favorite status of a listing.
   * If user is unauthenticated, redirects to login.
   */
  onToggle(id: string): void {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.favourites.toggle(id);
  }
}
