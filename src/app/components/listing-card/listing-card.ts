/**
 * Component for displaying an individual rental property card in the listing grid.
 * Displays photo, price, title, location, lease type, and provides a favorite toggle button.
 */
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Listing } from '../../models/listing';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css',
})
export class ListingCard {
  /** The listing data to display */
  listing = input.required<Listing>();

  /** Whether this listing is currently marked as favorite */
  isFavourite = input(false);

  /** Event emitted when the favorite button is clicked, passing listing ID */
  favouriteToggled = output<string>();
}
