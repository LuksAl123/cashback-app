import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExcludeAccountPageRoutingModule } from './delete-account-routing.module';
import { ExcludeAccountPage } from './delete-account.page';
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
