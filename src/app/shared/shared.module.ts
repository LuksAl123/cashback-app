import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponComponent } from '../components/coupon/coupon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EstablishmentComponent } from '../components/establishment/establishment.component';
import { IonicModule } from '@ionic/angular';
import { BackButtonComponent } from '../components/back-button/back-button.component';
import { LoadingComponent } from '../components/loading/loading.component';
import { MapComponent } from '../components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule } from '@angular/router';
import { ProfileModalComponent } from '../pages/home/profile/detail/profile-modal/profile-modal.component';

@NgModule({
  declarations: [CouponComponent, EstablishmentComponent, BackButtonComponent, LoadingComponent, MapComponent, ProfileModalComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    IonicModule,
    GoogleMapsModule,
    RouterModule,
    FormsModule
  ],
  exports: [CouponComponent, EstablishmentComponent, BackButtonComponent, FontAwesomeModule, LoadingComponent, MapComponent, ProfileModalComponent]
})

export class SharedModule { }
