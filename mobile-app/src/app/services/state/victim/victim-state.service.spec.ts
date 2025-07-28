import { TestBed } from '@angular/core/testing';

import { VictimStateService } from './victim-state.service';

describe('VictimStateService', () => {
  let service: VictimStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
