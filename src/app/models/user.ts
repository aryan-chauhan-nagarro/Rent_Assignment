/**
 * Represents an application user account.
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full display name of the user */
  name: string;
  /** Email address used for authentication */
  email: string;
  /** User account password */
  password: string;
}
