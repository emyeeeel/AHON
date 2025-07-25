import { TestBed } from '@angular/core/testing';

import { MissionApiService } from './mission-api.service';

describe('MissionApiService', () => {
  let service: MissionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
