/**
 * Component for previewing a rental post draft before final submission.
 * Displays key details, pricing, amenities, photos, and provides Edit / Confirm actions.
 */
import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Listing } from '../../models/listing';

@Component({
  selector: 'app-post-preview',
  imports: [CurrencyPipe],
  templateUrl: './post-preview.html',
  styleUrl: './post-preview.css',
})
export class PostPreview {
  /** The drafted listing object to preview */
  listing = input.required<Listing>();

  /** Event emitted when the user chooses to go back and edit the draft */
  edit = output<void>();

  /** Event emitted when the user confirms and publishes the draft */
  confirmed = output<void>();
}
