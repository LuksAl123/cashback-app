import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
  standalone: false
})

export class CouponComponent implements OnInit {
  
  campaignData: any = null;
  errorMsg: string | null = null;
  isLoading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCoupons();
  }

  get discountCoupons() {
    if (this.campaignData && this.campaignData.detalhe) {
      return this.campaignData.detalhe.filter((coupon: any) => coupon.tipo === 'CUPOM DE DESCONTO');
    }
    return [];
  }

  loadCoupons() {
    this.isLoading = true;

    this.apiService.getCampaignData()
      .pipe(
        catchError(error => {
          this.errorMsg = error.message || 'Could not load data.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe(response => {
        this.campaignData = response;
        this.isLoading = false;
      });
  }
}