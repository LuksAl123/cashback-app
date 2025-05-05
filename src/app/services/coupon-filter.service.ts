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

  setFilter(filter: CouponFilterType): void {
    this.filterSubject.next(filter);
  }

  getCurrentFilter(): CouponFilterType {
    return this.filterSubject.getValue();
  }
}
