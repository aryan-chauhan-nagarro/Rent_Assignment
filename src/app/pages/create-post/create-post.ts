/**
 * Create/Edit post page component.
 * Allows authenticated property owners to compose, preview, edit, and publish rental listings.
 */
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ListingService } from '../../services/listing';
import { ToastService } from '../../services/toast';
import { AMENITIES } from '../../constants/amenities';
import { Listing } from '../../models/listing';
import { notBlank } from '../../validators/not-blank';
import { PostPreview } from '../../components/post-preview/post-preview';

@Component({
  selector: 'app-create-post',
  imports: [ReactiveFormsModule, PostPreview],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private listingService = inject(ListingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  /** List of standard amenities for the checkbox group */
  readonly amenities = AMENITIES;
  /** Maximum length allowed for property description */
  readonly maxDescription = 1400;

  /** Signal holding the drafted listing during preview mode; null while editing */
  draft = signal<Listing | null>(null);

  /** Edit mode state */
  isEditMode = signal(false);
  editId = signal<string | null>(null);
  private originalListing: Listing | null = null;

  /** Main reactive form group for listing creation and editing */
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, notBlank, Validators.minLength(5), Validators.maxLength(80)]],
    description: [
      '',
      [Validators.required, notBlank, Validators.minLength(20), Validators.maxLength(this.maxDescription)],
    ],
    address: ['', [Validators.required, notBlank, Validators.minLength(5)]],
    squareFeet: [null as number | null, [Validators.required, Validators.min(50)]],
    rent: [null as number | null, [Validators.required, Validators.min(1)]],
    negotiable: [false],
    leaseType: ['long' as 'long' | 'short' | 'both', Validators.required],
    shared: [false],
    furnished: [false],
    vegetarianPreference: ['any' as 'veg' | 'non-veg' | 'any', Validators.required],
    contactPhone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    amenities: this.fb.nonNullable.group(
      Object.fromEntries(AMENITIES.map((a) => [a, false]))
    ),
    photos: this.fb.nonNullable.array([this.newPhotoControl()]),
  });

  /** Reference to the FormArray of photo URL controls */
  photos = this.form.controls.photos;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.editId.set(id);
      this.loadListingForEdit(id);
    }
  }

  /**
   * Loads existing listing data into the form when editing.
   */
  private loadListingForEdit(id: string): void {
    const user = this.auth.currentUser();
    this.listingService.getById(id).subscribe((listing) => {
      if (!listing) {
        this.toast.show('Listing not found', 'error');
        this.router.navigate(['/']);
        return;
      }
      if (listing.ownerId !== user?.id) {
        this.toast.show('You are not authorized to edit this listing', 'error');
        this.router.navigate(['/']);
        return;
      }

      this.originalListing = listing;

      // Reset photo controls to match listing photos count
      while (this.photos.length > 0) {
        this.photos.removeAt(0);
      }
      for (const photo of listing.photos) {
        this.photos.push(this.fb.nonNullable.control(photo, [
          Validators.required,
          Validators.pattern(/^https?:\/\/.+/),
        ]));
      }
      if (this.photos.length === 0) {
        this.photos.push(this.newPhotoControl());
      }

      // Populate amenities map
      const amenityValues: Record<string, boolean> = {};
      for (const a of AMENITIES) {
        amenityValues[a] = listing.amenities.includes(a);
      }

      this.form.patchValue({
        title: listing.title,
        description: listing.description,
        address: listing.address,
        squareFeet: listing.squareFeet,
        rent: listing.rent,
        negotiable: listing.negotiable,
        leaseType: listing.leaseType,
        shared: listing.shared,
        furnished: listing.furnished,
        vegetarianPreference: listing.vegetarianPreference || 'any',
        contactPhone: listing.contactPhone || '',
        amenities: amenityValues,
      });
    });
  }

  /**
   * Helper factory creating a photo URL form control with URL pattern validation.
   */
  private newPhotoControl() {
    return this.fb.nonNullable.control('', [
      Validators.required,
      Validators.pattern(/^https?:\/\/.+/),
    ]);
  }

  /**
   * Appends a new photo URL input field to the form array.
   */
  addPhoto(): void {
    this.photos.push(this.newPhotoControl());
  }

  /**
   * Removes a photo URL input field at the specified index.
   *
   * @param index - Position in the photos FormArray.
   */
  removePhoto(index: number): void {
    this.photos.removeAt(index);
  }

  /**
   * Checks whether a form control has been touched and has a specific validation error.
   *
   * @param name - Control path or name.
   * @param error - Error key to test for.
   */
  hasError(name: string, error: string): boolean {
    const control = this.form.get(name);
    return !!control && control.touched && control.hasError(error);
  }

  /**
   * Constructs a typed Listing object from the current form values and authenticated owner details.
   */
  private buildListing(): Listing | null {
    const user = this.auth.currentUser();
    if (!user) {
      return null;
    }
    const v = this.form.getRawValue();
    return {
      id: this.editId() ?? crypto.randomUUID(),
      ownerId: this.originalListing?.ownerId ?? user.id,
      ownerName: this.originalListing?.ownerName ?? user.name,
      title: v.title.trim(),
      description: v.description.trim(),
      address: v.address.trim(),
      squareFeet: v.squareFeet!,
      rent: v.rent!,
      negotiable: v.negotiable,
      leaseType: v.leaseType,
      furnished: v.furnished,
      vegetarianPreference: v.vegetarianPreference,
      shared: v.shared,
      amenities: AMENITIES.filter((a) => v.amenities[a]),
      photos: v.photos.map((p) => p.trim()),
      featured: this.originalListing?.featured ?? false,
      createdAt: this.originalListing?.createdAt ?? new Date().toISOString(),
      contactPhone: v.contactPhone,
    };
  }

  /**
   * Validates the form and transitions into preview mode if valid.
   */
  onPreview(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const listing = this.buildListing();
    if (listing) {
      this.draft.set(listing);
      window.scrollTo({ top: 0 });
    }
  }

  /**
   * Exits preview mode and returns to the form edit view.
   */
  backToEdit(): void {
    this.draft.set(null);
  }

  /**
   * Confirms and persists the drafted listing, displays a success toast, and navigates.
   */
  confirm(): void {
    const listing = this.draft();
    if (!listing) {
      return;
    }

    if (this.isEditMode()) {
      this.listingService.update(listing).subscribe(() => {
        this.toast.show('Listing updated successfully', 'success');
        this.router.navigate(['/listing', listing.id]);
      });
    } else {
      this.listingService.add(listing).subscribe(() => {
        this.toast.show('Listing published successfully', 'success');
        this.router.navigate(['/']);
      });
    }
  }
}
