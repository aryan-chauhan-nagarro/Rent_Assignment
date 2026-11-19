/**
 * Comment service managing comments and nested replies on property listings.
 */
import { Service, inject, signal } from '@angular/core';
import { StorageService } from './storage';
import { Auth } from './auth';
import { Comment } from '../models/comment';

const KEY = 'comments';

@Service()
export class CommentService {
  private storage = inject(StorageService);
  private auth = inject(Auth);

  /** Internal signal storing all comments persisted in the system */
  private all = signal<Comment[]>(this.storage.get<Comment[]>(KEY) ?? []);

  /** Read-only signal exposure of all comments */
  readonly comments = this.all.asReadonly();

  /**
   * Adds a top-level comment or a nested reply to a listing.
   *
   * @param listingId - The target listing ID.
   * @param text - The comment message body.
   * @param parentId - The parent comment ID if nested reply, or null if top-level.
   */
  add(listingId: string, text: string, parentId: string | null): void {
    const user = this.auth.currentUser();
    if (!user) {
      return;
    }
    const comment: Comment = {
      id: crypto.randomUUID(),
      listingId,
      userId: user.id,
      userName: user.name,
      text: text.trim(),
      parentId,
      createdAt: new Date().toISOString(),
    };
    this.all.update((list) => [...list, comment]);
    this.storage.set(KEY, this.all());
  }

  /**
   * Removes a comment and any direct replies associated with it.
   *
   * @param id - The ID of the comment to remove.
   */
  remove(id: string): void {
    this.all.update((list) => list.filter((c) => c.id !== id && c.parentId !== id));
    this.storage.set(KEY, this.all());
  }
}
