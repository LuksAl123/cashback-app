import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponComponent } from '../components/coupon/coupon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [CouponComponent],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [CouponComponent]
})

export class SharedModule { }
