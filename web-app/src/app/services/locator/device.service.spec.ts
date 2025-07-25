import { TestBed } from '@angular/core/testing';

import { DroneService } from './device.service';

describe('DroneService', () => {
  let service: DroneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DroneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
