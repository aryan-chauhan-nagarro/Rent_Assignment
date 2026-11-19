/**
 * Route resolver for property listings.
 * Fetches the listing details using the route parameter 'id' before the route activates.
 * If the listing is not found, redirects the user back to the home page.
 */
import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { Listing } from '../models/listing';
import { ListingService } from '../services/listing';

export const listingResolver: ResolveFn<Listing> = (route) => {
  const listingService = inject(ListingService);
  const router = inject(Router);
  const id = route.paramMap.get('id')!;

  return listingService.getById(id).pipe(
    // If listing doesn't exist, issue a redirect to home route
    map((listing) => listing ?? new RedirectCommand(router.parseUrl('/')))
  );
};
