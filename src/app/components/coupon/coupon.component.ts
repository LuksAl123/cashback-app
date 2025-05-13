import { Component, EventEmitter, OnInit, OnDestroy, Output, Input, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api/api.service';
import { CouponFilterService, CouponFilterType } from '../../services/coupon-filter.service';
import { of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss'],
  standalone: false
})

export class CouponComponent implements OnInit, OnDestroy {

  @Output() loadingChange = new EventEmitter<boolean>();
  @Input() forceDefaultBehavior = false;

  campaignData: any = null;
  errorMsg: string | null = null;
  isLoading: boolean = true;
  isOnCouponsPage: boolean = false;
  currentFilter: CouponFilterType = CouponFilterType.ALL;

  private filterSubscription: Subscription | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    @Optional() private couponFilterService: CouponFilterService
  ) {}

  ngOnInit() {
    this.detectContext();
    this.subscribeToFilterChanges();
    this.loadCoupons();
  }

  ngOnDestroy() {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  private detectContext() {
    const currentUrl = this.router.url;
    this.isOnCouponsPage = currentUrl.includes('/coupons');
  }

  private subscribeToFilterChanges() {
    if (this.isOnCouponsPage && this.couponFilterService) {
      this.filterSubscription = this.couponFilterService.currentFilter$.subscribe(filter => {
        this.currentFilter = filter;
      });
    }
  }

  get filteredCoupons() {
    const coupons = this.discountCoupons;

    // Return all coupons if not on Coupons page or default behavior is forced
    if (!this.isOnCouponsPage || this.forceDefaultBehavior) {
      return coupons;
    }

    // Apply filters based on the selected segment
    switch (this.currentFilter) {
      case CouponFilterType.AVAILABLE:
        return coupons.filter((coupon: any) => !coupon.isActive);
      case CouponFilterType.ACTIVE:
        return coupons.filter((coupon: any) => coupon.isActive);
      case CouponFilterType.ALL:
      default:
        return coupons;
    }
  }

  get discountCoupons() {
    if (this.campaignData && this.campaignData.detalhe) {
      return this.campaignData.detalhe
        .filter((coupon: any) => coupon.tipo === 'CUPOM DE DESCONTO')
        .map((coupon: any) => ({
          ...coupon,
          // Assume a coupon is active if it has an activation date
          // You'll need to adjust this logic based on your actual data model
          isActive: !!coupon.dataAtivacao
        }));
    }
    return [];
  }

  getButtonText(coupon: any): string {
    // Default behavior for non-Coupons pages
    if (!this.isOnCouponsPage || this.forceDefaultBehavior) {
      return 'Abrir cupom';
    }

    // Button text based on filter and coupon state
    if (this.currentFilter === CouponFilterType.AVAILABLE) {
      return 'Ativar Cupom';
    } else if (this.currentFilter === CouponFilterType.ACTIVE) {
      return 'Cupom Ativo!';
    } else {
      // For "Todos" filter, show appropriate text based on coupon state
      return coupon.isActive ? 'Cupom Ativo!' : 'Ativar Cupom';
    }
  }

  loadCoupons() {
    this.isLoading = true;
    this.loadingChange.emit(this.isLoading);

    this.apiService.getCampaignData()
      .pipe(
        catchError(error => {
          this.errorMsg = error.message || 'Could not load data.';
          this.isLoading = false;
          this.loadingChange.emit(this.isLoading);
          return of(null);
        })
      )
      .subscribe(response => {
        setTimeout(() => {
          this.campaignData = response;
          this.isLoading = false;
          this.loadingChange.emit(this.isLoading);
        }, 2000);
      });
  }

  activateCoupon(coupon: any, event: Event) {
    console.log('Activating coupon:', coupon.id);
    
  }
}