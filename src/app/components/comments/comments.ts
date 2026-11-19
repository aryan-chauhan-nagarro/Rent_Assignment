/**
 * Component for listing, adding, and replying to comments on a property listing.
 * Supports single-level nested replies and author comment deletion.
 */
import { Component, computed, inject, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../services/comment';
import { Auth } from '../../services/auth';
import { Comment } from '../../models/comment';
import { notBlank } from '../../validators/not-blank';

@Component({
  selector: 'app-comments',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments {
  private commentService = inject(CommentService);
  auth = inject(Auth);

  /** Required listing identifier */
  listingId = input.required<string>();

  /** Optional property owner user identifier */
  ownerId = input<string>();

  /** Filter comments specifically for the current listing */
  forListing = computed(() =>
    this.commentService.comments().filter((c) => c.listingId === this.listingId())
  );

  /** Top-level comments (comments without a parent ID) */
  topLevel = computed(() => this.forListing().filter((c) => c.parentId === null));

  /** Grouped map of replies indexed by parent comment ID */
  replies = computed(() => {
    const map: Record<string, Comment[]> = {};
    for (const c of this.forListing()) {
      if (c.parentId) {
        (map[c.parentId] ??= []).push(c);
      }
    }
    return map;
  });

  /** Form control for posting new top-level comments */
  commentControl = this.newControl();

  /** Form control for typing replies to an existing comment */
  replyControl = this.newControl();

  /** ID of the comment currently being replied to, or null */
  replyingTo = signal<string | null>(null);

  /**
   * Helper factory creating a standardized validated FormControl for comment input.
   */
  private newControl() {
    return new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, notBlank, Validators.maxLength(500)],
    });
  }

  /**
   * Submits a new top-level comment for the current listing.
   */
  postComment(): void {
    if (this.commentControl.invalid) {
      this.commentControl.markAsTouched();
      return;
    }
    this.commentService.add(this.listingId(), this.commentControl.value, null);
    this.commentControl.reset();
  }

  /**
   * Activates reply mode for a specific parent comment.
   *
   * @param id - Parent comment ID.
   */
  startReply(id: string): void {
    this.replyControl.reset();
    this.replyingTo.set(id);
  }

  /**
   * Cancels the active reply operation and clears replying state.
   */
  cancelReply(): void {
    this.replyingTo.set(null);
  }

  /**
   * Submits a nested reply for a specific parent comment.
   *
   * @param parentId - Parent comment ID.
   */
  postReply(parentId: string): void {
    if (this.replyControl.invalid) {
      this.replyControl.markAsTouched();
      return;
    }
    this.commentService.add(this.listingId(), this.replyControl.value, parentId);
    this.replyingTo.set(null);
  }

  /**
   * Deletes a comment by ID.
   *
   * @param id - The ID of the comment to remove.
   */
  remove(id: string): void {
    this.commentService.remove(id);
  }
}
