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
  
  campaignData: CampaignData | null = null;
  errorMsg: string | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getCampaignData()
      .pipe(
        catchError(error => {
          this.errorMsg = error.message || 'Could not load data.';
          return of(null);
        })
      )
      .subscribe(data => {
        this.campaignData = data;
      });
  }
}
