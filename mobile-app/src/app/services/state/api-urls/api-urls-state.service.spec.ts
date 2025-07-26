import { TestBed } from '@angular/core/testing';

import { ApiUrlsStateService } from './api-urls-state.service';

describe('ApiUrlsStateService', () => {
  let service: ApiUrlsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUrlsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
