import { TestBed } from '@angular/core/testing';

import { TimeState } from './time-state';

describe('TimeState', () => {
  let service: TimeState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
