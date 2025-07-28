import { TestBed } from '@angular/core/testing';

import { VictimApiService } from './victim-api.service';

describe('VictimApiService', () => {
  let service: VictimApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
