import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound Component', () => {
  let component: NotFound;
  let fixture: ComponentFixture<NotFound>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFound);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the not-found component', () => {
    expect(component).toBeTruthy();
  });

  it('should display 404 and Page Not Found message', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.error-code')?.textContent).toContain('404');
    expect(el.querySelector('h1')?.textContent).toContain('Page Not Found');
    expect(el.querySelector('.btn-home')?.getAttribute('href')).toBe('/');
  });
});
