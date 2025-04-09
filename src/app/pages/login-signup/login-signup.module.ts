import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-signup-routing.module';
import { LoginPage } from './login-signup.page';
import { MaskitoDirective } from '@maskito/angular';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    SharedModule,
    MaskitoDirective
  ],
  declarations: [LoginPage]
})

export class LoginPageModule {}
