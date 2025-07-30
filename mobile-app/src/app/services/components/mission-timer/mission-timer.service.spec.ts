import { TestBed } from '@angular/core/testing';

import { MissionTimerService } from './mission-timer.service';

describe('MissionTimerService', () => {
  let service: MissionTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MissionTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
