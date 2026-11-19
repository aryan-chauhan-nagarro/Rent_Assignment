import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostPreview } from './post-preview';
import { Listing } from '../../models/listing';

describe('PostPreview Component', () => {
  let component: PostPreview;
  let fixture: ComponentFixture<PostPreview>;

  const mockListing: Listing = {
    id: 'draft-1',
    ownerId: 'u1',
    ownerName: 'Owner User',
    title: 'Luxury 3BHK Apartment',
    description: 'Spacious flat with modern modular kitchen and parking.',
    address: '42 MG Road, Agra',
    squareFeet: 1200,
    rent: 2200,
    negotiable: true,
    leaseType: 'long',
    furnished: true,
    vegetarianPreference: 'veg',
    shared: false,
    amenities: ['Gym', 'Swimming Pool'],
    photos: ['https://example.com/photo1.jpg'],
    featured: false,
    createdAt: '2026-11-01T00:00:00.000Z',
    contactPhone: '9876543210',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(PostPreview);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('listing', mockListing);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the draft listing details and food preference', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Preview and Submit');
    expect(el.textContent).toContain('Luxury 3BHK Apartment');
    expect(el.textContent).toContain('42 MG Road, Agra');
    expect(el.textContent).toContain('Veg Only');
    expect(el.textContent).toContain('Gym');
    expect(el.textContent).toContain('Swimming Pool');
  });

  it('should emit edit event when "Back to edit" button is clicked', () => {
    let editCalled = false;
    component.edit.subscribe(() => (editCalled = true));

    const editBtn = fixture.nativeElement.querySelector('.buttons button.secondary') as HTMLButtonElement;
    editBtn.click();

    expect(editCalled).toBe(true);
  });

  it('should emit confirmed event when "Confirm and Publish" button is clicked', () => {
    let confirmedCalled = false;
    component.confirmed.subscribe(() => (confirmedCalled = true));

    const confirmBtn = fixture.nativeElement.querySelectorAll('.buttons button')[1] as HTMLButtonElement;
    confirmBtn.click();

    expect(confirmedCalled).toBe(true);
  });
});
