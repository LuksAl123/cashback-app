import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PerEstablishmentPageRoutingModule } from './per-establishment-routing.module';
import { PerEstablishmentPage } from './per-establishment.page';
import { DetailsComponent } from './details/details.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerEstablishmentPageRoutingModule,
    SharedModule
  ],
  declarations: [PerEstablishmentPage, DetailsComponent]
})

export class PerEstablishmentPageModule {}