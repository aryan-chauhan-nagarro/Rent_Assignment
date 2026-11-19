import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { listingResolver } from './listing-resolver';
import { Listing } from '../models/listing';

describe('listingResolver', () => {
  const executeResolver: ResolveFn<Listing> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => listingResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be defined', () => {
    expect(executeResolver).toBeDefined();
  });
});
