import { TestBed } from '@angular/core/testing';

import { VictimDataService } from './victim-data.service';

describe('VictimDataService', () => {
  let service: VictimDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
