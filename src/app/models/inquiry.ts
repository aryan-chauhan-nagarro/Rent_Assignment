/**
 * Represents a direct inquiry or message sent to a listing owner.
 */
export interface Inquiry {
  /** Unique identifier for the inquiry message */
  id: string;
  /** ID of the property listing inquired about */
  listingId: string;
  /** Title of the listing at the time of inquiry */
  listingTitle: string;
  /** ID of the property owner receiving the inquiry */
  ownerId: string;
  /** ID of the sender user */
  fromUserId: string;
  /** Display name of the sender */
  fromName: string;
  /** Email address of the sender */
  fromUserEmail?: string;
  /** Message body content */
  message: string;
  /** ISO timestamp when the inquiry was sent */
  createdAt: string;
}
