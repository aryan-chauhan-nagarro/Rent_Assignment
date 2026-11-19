/**
 * Represents a rental property listing posted by a user.
 */
export interface Listing {
  /** Unique identifier for the listing */
  id: string;
  /** User ID of the listing owner */
  ownerId: string;
  /** Display name of the listing owner */
  ownerName: string;
  /** Headline title of the property */
  title: string;
  /** Detailed description of the rental property */
  description: string;
  /** Physical street address or location */
  address: string;
  /** Area of property in square feet */
  squareFeet: number;
  /** Monthly rental price */
  rent: number;
  /** Optional phone number for prospective tenants to call */
  contactPhone?: string;
  /** Indicates whether the rent price is negotiable */
  negotiable: boolean;
  /** Permissible lease duration type */
  leaseType: 'long' | 'short' | 'both';
  /** Whether the property is furnished */
  furnished: boolean;
  /** Dietary / vegetarian preference */
  vegetarianPreference: 'veg' | 'non-veg' | 'any';
  /** Whether the property accommodation is shared */
  shared: boolean;
  /** List of available amenities in the property */
  amenities: string[];
  /** URLs pointing to images of the listing */
  photos: string[];
  /** Flag marking highlighted/featured status on the homepage */
  featured: boolean;
  /** ISO timestamp when the listing was created */
  createdAt: string;
}
