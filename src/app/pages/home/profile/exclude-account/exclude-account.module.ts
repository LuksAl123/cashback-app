import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExcludeAccountPageRoutingModule } from './exclude-account-routing.module';
import { ExcludeAccountPage } from './exclude-account.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExcludeAccountPageRoutingModule,
    SharedModule
  ],
  declarations: [ExcludeAccountPage]
})
export class ExcludeAccountPageModule {}
