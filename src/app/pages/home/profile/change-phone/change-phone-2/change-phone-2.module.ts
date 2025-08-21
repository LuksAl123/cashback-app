import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePhone2PageRoutingModule } from './change-phone-2-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangePhone2Page } from './change-phone-2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePhone2PageRoutingModule,
    SharedModule,
  ],
  declarations: [ChangePhone2Page],
})
export class ChangePhone2PageModule {}
