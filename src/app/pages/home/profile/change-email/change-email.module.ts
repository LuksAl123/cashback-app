import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChangeEmailPageRoutingModule } from './change-email-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChangeEmailPage } from './change-email.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeEmailPageRoutingModule,
    SharedModule
  ],
  declarations: [ChangeEmailPage]
})
export class ChangeEmailPageModule {}
