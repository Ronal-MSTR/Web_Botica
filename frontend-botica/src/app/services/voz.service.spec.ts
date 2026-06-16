import { TestBed } from '@angular/core/testing';

import { VozService } from './voz.service';

describe('VozService', () => {
  let service: VozService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VozService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
