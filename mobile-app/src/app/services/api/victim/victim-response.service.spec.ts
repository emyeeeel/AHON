import { TestBed } from '@angular/core/testing';

import { VictimResponseService } from './victim-response.service';

describe('VictimResponseService', () => {
  let service: VictimResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
