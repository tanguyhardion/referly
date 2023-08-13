import { TestBed } from '@angular/core/testing';

import { DbinfoService } from './dbinfo.service';

describe('DbinfoService', () => {
  let service: DbinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
