import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LocationsPageRoutingModule } from './locations-routing.module';
import { LocationsPage } from './locations.page';
import { BottomSheetComponent } from 'src/app/components/bottom-sheet/bottom-sheet.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    LocationsPageRoutingModule,
    SharedModule
  ],
  declarations: [LocationsPage, BottomSheetComponent]
})

export class LocationsPageModule {}
