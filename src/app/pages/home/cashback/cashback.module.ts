import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CashbackPageRoutingModule } from './cashback-routing.module';
import { CashbackPage } from './cashback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CashbackPageRoutingModule
  ],
  declarations: [CashbackPage]
})

export class CashbackPageModule {}
