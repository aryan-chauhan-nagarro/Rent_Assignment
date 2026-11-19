/**
 * Listing details page component.
 * Displays comprehensive details for a specific listing, including photo gallery,
 * amenities list, owner inquiry form, and interactive comments section.
 */
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { map } from 'rxjs';
import { Listing } from '../../models/listing';
import { Auth } from '../../services/auth';
import { FavouriteService } from '../../services/favourite';
import { Comments } from '../../components/comments/comments';
import { InquiryService } from '../../services/inquiry';
import { ListingService } from '../../services/listing';
import { ToastService } from '../../services/toast';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { notBlank } from '../../validators/not-blank';

@Component({
  selector: 'app-details',
  imports: [RouterLink, CurrencyPipe, DatePipe, Comments, ReactiveFormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);
  private favourites = inject(FavouriteService);
  private toast = inject(ToastService);
  private inquiryService = inject(InquiryService);
  private listingService = inject(ListingService);

  /** Listing data resolved from the route resolver */
  listing = toSignal(this.route.data.pipe(map((d) => d['listing'] as Listing)));

  /** Checks whether the authenticated user is the owner of this listing */
  isOwner = computed(() => {
    const l = this.listing();
    const u = this.auth.currentUser();
    return !!l && !!u && l.ownerId === u.id;
  });

  /** Index of the currently highlighted photo in the gallery */
  selectedPhoto = signal(0);

  /** Photo URL of the currently selected gallery photo */
  mainPhoto = computed(() => this.listing()?.photos[this.selectedPhoto()] ?? '');

  /** Reactive boolean indicating whether the viewed listing is favorited by the active user */
  isFavourite = computed(() => {
    const l = this.listing();
    return !!l && this.favourites.ids().includes(l.id);
  });

  /**
   * Toggles favorite status for the current listing, redirecting to login if unauthenticated.
   */
  toggleFavourite(): void {
    const l = this.listing();
    if (!l) return;
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.favourites.toggle(l.id);
  }

  /** Form control for typing an inquiry message to the owner */
  inquiryControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, notBlank, Validators.maxLength(300)],
  });

  /**
   * Computed boolean checking if current user can inquire.
   * Only logged-in users who are NOT the owner of the listing can send an inquiry.
   */
  canInquire = computed(() => {
    const l = this.listing();
    const u = this.auth.currentUser();
    return !!l && !!u && l.ownerId !== u.id;
  });

  /**
   * Sends the inquiry message to the property owner and alerts the user with a toast.
   */
  sendInquiry(): void {
    const l = this.listing();
    if (!l) return;
    if (this.inquiryControl.invalid) {
      this.inquiryControl.markAsTouched();
      return;
    }
    this.inquiryService.send(l, this.inquiryControl.value);
    this.inquiryControl.reset();
    this.toast.show('Inquiry sent to the owner', 'success');
  }

  /**
   * Deletes the listing if the owner confirms.
   */
  deleteListing(): void {
    const l = this.listing();
    if (!l) return;
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      this.listingService.delete(l.id).subscribe(() => {
        this.toast.show('Listing deleted successfully', 'info');
        this.router.navigate(['/']);
      });
    }
  }
}
