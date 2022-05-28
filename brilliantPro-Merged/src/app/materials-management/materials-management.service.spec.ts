import { TestBed } from '@angular/core/testing';

import { MaterialsManagementService } from './materials-management.service';

describe('MaterialsManagementService', () => {
  let service: MaterialsManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialsManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
