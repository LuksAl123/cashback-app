import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EstablishmentPageRoutingModule } from './establishment-routing.module';
import { EstablishmentPage } from './establishment.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstablishmentPageRoutingModule,
    SharedModule
  ],
  declarations: [EstablishmentPage]
})

export class EstablishmentPageModule {}
