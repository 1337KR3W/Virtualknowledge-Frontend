import { TestBed } from '@angular/core/testing';

import { DataManagement } from './data-management';

describe('DataManagement', () => {
  let service: DataManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
