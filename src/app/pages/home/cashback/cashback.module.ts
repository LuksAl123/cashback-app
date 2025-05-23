import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CashbackPageRoutingModule } from './cashback-routing.module';
import { CashbackPage } from './cashback.page';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CashbackPageRoutingModule,
    SharedModule
  ],
  declarations: [CashbackPage]
})

export class CashbackPageModule {}
