import { TestBed } from '@angular/core/testing';

import { SconfigService } from './sconfig.service';

describe('SconfigService', () => {
  let service: SconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
