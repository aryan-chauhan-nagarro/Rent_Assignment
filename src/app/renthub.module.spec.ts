import { TestBed } from '@angular/core/testing';
import { RentHubModule } from './renthub.module';

describe('RentHubModule', () => {
  let module: RentHubModule;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RentHubModule],
    });
    module = TestBed.inject(RentHubModule);
  });

  it('should initialize and create the module instance', () => {
    expect(module).toBeTruthy();
  });
});
