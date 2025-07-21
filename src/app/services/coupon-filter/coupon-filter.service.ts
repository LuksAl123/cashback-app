import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum CouponFilterType {
  ALL = 'Todos',
  AVAILABLE = 'Disponíveis',
  ACTIVE = 'Ativos'
}

@Injectable({
  providedIn: 'root'
})

export class CouponFilterService {

  private filterSubject = new BehaviorSubject<CouponFilterType>(CouponFilterType.ALL);
  public currentFilter$: Observable<CouponFilterType> = this.filterSubject.asObservable();

  constructor() {}

  setFilter(index: number): CouponFilterType {
    switch (index) {
      case 0:
        this.filterSubject.next(CouponFilterType.ALL);
        break;
      case 1:
        this.filterSubject.next(CouponFilterType.AVAILABLE);
        break;
      case 2:
        this.filterSubject.next(CouponFilterType.ACTIVE);
        break;
    }
    return this.filterSubject.getValue();
  }

  getCurrentFilter(): CouponFilterType {
    return this.filterSubject.getValue();
  }
}