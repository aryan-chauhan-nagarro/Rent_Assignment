import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Comments } from './comments';
import { CommentService } from '../../services/comment';
import { StorageService } from '../../services/storage';
import { Auth } from '../../services/auth';

describe('Comments Component', () => {
  let component: Comments;
  let fixture: ComponentFixture<Comments>;
  let storage: StorageService;
  let auth: Auth;
  let commentService: CommentService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Comments],
      providers: [provideRouter([])],
    }).compileComponents();

    storage = TestBed.inject(StorageService);
    auth = TestBed.inject(Auth);
    commentService = TestBed.inject(CommentService);

    // Clean storage
    storage.remove('comments');
    storage.remove('currentUser');

    fixture = TestBed.createComponent(Comments);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('listingId', 'listing-123');
    fixture.componentRef.setInput('ownerId', 'owner-456');
    fixture.detectChanges();
  });

  it('should create the comments component', () => {
    expect(component).toBeTruthy();
  });

  it('should show empty message when there are no comments', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('No comments yet');
  });

  it('should allow typing and posting a top-level comment when logged in', () => {
    // Log in user
    auth.register('John Doe', 'john@example.com', 'password123');
    fixture.detectChanges();

    component.commentControl.setValue('Is this apartment still available?');
    component.postComment();
    fixture.detectChanges();

    expect(component.forListing().length).toBe(1);
    expect(component.forListing()[0].text).toBe('Is this apartment still available?');
    expect(component.commentControl.value).toBe('');
  });

  it('should toggle reply mode for a comment', () => {
    component.startReply('comment-1');
    expect(component.replyingTo()).toBe('comment-1');

    component.cancelReply();
    expect(component.replyingTo()).toBeNull();
  });
});
