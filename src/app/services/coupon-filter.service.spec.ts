import { TestBed } from '@angular/core/testing';

import { CouponFilterService } from './coupon-filter.service';

describe('CouponFilterService', () => {
  let service: CouponFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CouponFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
