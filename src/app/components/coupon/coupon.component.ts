import { Component, EventEmitter, OnInit, OnDestroy, Output, Input, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/services/http/http.service';
import { CouponFilterService, CouponFilterType } from '../../services/coupon-filter/coupon-filter.service';
import { UserService } from '../../services/user/user.service';
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
  isOnHomePage: boolean = false;
  currentFilter: CouponFilterType = CouponFilterType.ALL;

  private filterSubscription: Subscription | null = null;

  constructor(
    private httpService: HttpService,
    private router: Router,
    @Optional() private couponFilterService: CouponFilterService,
    private userService: UserService
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
    this.isOnHomePage = currentUrl.includes('/home');
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
    if (!this.isOnCouponsPage || this.forceDefaultBehavior) {
      return coupons;
    }
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
          isActive: !!coupon.ncupomativo
        }));
    }
    return [];
  }

  getButtonText(coupon: any): string {
    if (!this.isOnCouponsPage || this.forceDefaultBehavior) {
      return 'Abrir cupom';
    }
    if (this.currentFilter === CouponFilterType.AVAILABLE) {
      return 'Ativar Cupom';
    } else if (this.currentFilter === CouponFilterType.ACTIVE) {
      return 'Cupom Ativo!';
    } else {
      return coupon.isActive ? 'Cupom Ativo!' : 'Ativar Cupom';
    }
  }

  loadCoupons() {
    this.isLoading = true;
    this.loadingChange.emit(this.isLoading);

    this.httpService.getCouponData()
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
    const userId = this.userService.getUserId();
    if (!userId) {
      console.error('User ID not found');
      return;
    }
    this.httpService.activateCoupon(coupon.ncupom, userId).subscribe({
      next: (response) => {
        console.log('Coupon activated successfully:', response);

      },
      error: (err) => {
        console.error('Failed to activate coupon:', err);
      }
    });
  }

  openCoupon(coupon: any, event: Event) {
    this.router.navigate(['/coupon', coupon.ncupom]);
  }
}
