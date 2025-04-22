import { Component, OnInit } from '@angular/core';
import { ApiService, CampaignData } from '../../services/api/api.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
  standalone: false
})

export class CouponComponent implements OnInit {

  campaignData$: Observable<CampaignData | null>;
  errorMsg: string | null = null;

  constructor(private apiService: ApiService) {
      this.campaignData$ = this.apiService.getCampaignData().pipe(
          catchError(error => {
              this.errorMsg = error.message || 'Could not load data.';
              return of(null);
          })
      );
  }

  ngOnInit() {
  }

  refresh(): void {
    console.log('Forcing data refresh...');
    this.errorMsg = null;
    this.campaignData$ = this.apiService.forceRefresh().pipe(
       catchError(error => {
              this.errorMsg = error.message || 'Could not load data after refresh.';
              return of(null);
          })
    );
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, CampaignData } from '../../services/api/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-coupon-manual',
  template: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
  standalone: false
})

export class CouponManualComponent implements OnInit, OnDestroy {

  campaignData: CampaignData | null = null;
  isLoading = false;
  errorMsg: string | null = null;
  private dataSubscription: Subscription | null = null;

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.errorMsg = null;
    this.campaignData = null;

    if (this.dataSubscription) {
        this.dataSubscription.unsubscribe();
    }

    this.dataSubscription = this.apiService.getCampaignData().subscribe({
          next: (data) => {
              this.campaignData = data;
              this.isLoading = false;
              console.log('Data received in component (manual sub):', data);
          },
          error: (error) => {
              this.errorMsg = error.message || 'Could not load data.';
              this.isLoading = false;
              console.error('Error in component (manual sub):', error);
          },
          complete: () => {
              this.isLoading = false;
          }
      });
  }

  refresh(): void {
    console.log('Forcing data refresh (manual sub)...');
    this.apiService.clearCache();
    this.fetchData();
}

  ngOnDestroy(): void {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }
}
