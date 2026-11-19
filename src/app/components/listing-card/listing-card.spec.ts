import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ListingCard } from './listing-card';
import { Listing } from '../../models/listing';

describe('ListingCard Component', () => {
  let component: ListingCard;
  let fixture: ComponentFixture<ListingCard>;

  const mockListing: Listing = {
    id: 'test-101',
    ownerId: 'owner-1',
    ownerName: 'Test Owner',
    title: 'Spacious City Apartment',
    description: 'Beautiful 2BHK located in the heart of downtown.',
    address: '100 Main Street',
    squareFeet: 850,
    rent: 1500,
    negotiable: true,
    leaseType: 'long',
    furnished: true,
    vegetarianPreference: 'veg',
    shared: false,
    amenities: ['Gym', 'Parking'],
    photos: ['https://example.com/photo.jpg'],
    featured: true,
    createdAt: '2026-11-01T00:00:00.000Z',
    contactPhone: '9876543210',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListingCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ListingCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('listing', mockListing);
    fixture.componentRef.setInput('isFavourite', false);
    fixture.detectChanges();
  });

  it('should create the listing card component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the listing title, address, and food preference badge', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.textContent).toContain('Spacious City Apartment');
    expect(el.querySelector('.address')?.textContent).toContain('100 Main Street');
    expect(el.querySelector('.badge-tag')?.textContent).toContain('Veg Only');
  });

  it('should display favourite status correctly based on input', () => {
    const el = fixture.nativeElement as HTMLElement;
    const button = el.querySelector('.actions button') as HTMLButtonElement;
    expect(button.textContent).toContain('Mark as Favourite');

    // Update input to favourite
    fixture.componentRef.setInput('isFavourite', true);
    fixture.detectChanges();
    expect(button.textContent).toContain('Favourited');
  });

  it('should emit favouriteToggled event with listing ID when button is clicked', () => {
    let emittedId = '';
    component.favouriteToggled.subscribe((id) => (emittedId = id));

    const button = fixture.nativeElement.querySelector('.actions button') as HTMLButtonElement;
    button.click();

    expect(emittedId).toBe('test-101');
  });
});
