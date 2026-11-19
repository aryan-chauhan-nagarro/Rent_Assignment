/**
 * Represents a comment or reply posted under a property listing.
 */
export interface Comment {
  /** Unique identifier for the comment */
  id: string;
  /** Listing ID that this comment belongs to */
  listingId: string;
  /** ID of the author user */
  userId: string;
  /** Author's display name */
  userName: string;
  /** Text content of the comment */
  text: string;
  /** ID of the parent comment if this is a reply; null for top-level comments */
  parentId: string | null;
  /** ISO timestamp when the comment was created */
  createdAt: string;
}
