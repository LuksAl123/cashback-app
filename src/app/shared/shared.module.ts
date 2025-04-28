import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponComponent } from '../components/coupon/coupon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentComponent } from '../components/establishment/establishment.component';
import { IonicModule } from '@ionic/angular';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { LoadingComponent } from '../components/loading/loading.component';

@NgModule({
  declarations: [CouponComponent, EstablishmentComponent, BackButtonComponent, LoadingComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    IonicModule
  ],
  exports: [CouponComponent, EstablishmentComponent, BackButtonComponent, FontAwesomeModule, LoadingComponent]
})

export class SharedModule { }
