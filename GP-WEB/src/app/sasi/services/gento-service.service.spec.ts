import { TestBed } from '@angular/core/testing';

import { GentoServiceService } from './gento-service.service';

describe('GentoServiceService', () => {
  let service: GentoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GentoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
