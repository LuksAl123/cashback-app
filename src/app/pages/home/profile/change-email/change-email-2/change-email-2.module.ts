import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangeEmail2PageRoutingModule } from './change-email-2-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeEmail2Page } from './change-email-2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeEmail2PageRoutingModule,
    SharedModule,
  ],
  declarations: [ChangeEmail2Page],
})
export class ChangeEmail2PageModule {}
