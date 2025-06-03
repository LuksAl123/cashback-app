import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CouponComponent } from '../components/coupon/coupon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentComponent } from '../components/establishment/establishment.component';
import { IonicModule } from '@ionic/angular';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { MapComponent } from '../components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [CouponComponent, EstablishmentComponent, BackButtonComponent, LoadingComponent, MapComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    IonicModule,
    GoogleMapsModule
  ],
  exports: [CouponComponent, EstablishmentComponent, BackButtonComponent, FontAwesomeModule, LoadingComponent, MapComponent]
})

export class SharedModule { }
