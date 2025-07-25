import { TestBed } from '@angular/core/testing';

import { DeviceStreamService } from './device-stream.service';

describe('DeviceStreamService', () => {
  let service: DeviceStreamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeviceStreamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
