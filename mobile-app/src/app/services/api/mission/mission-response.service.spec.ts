import { TestBed } from '@angular/core/testing';

import { MissionResponseService } from './mission-response.service';

describe('MissionResponseService', () => {
  let service: MissionResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
