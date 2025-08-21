import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePhonePage } from './change-phone.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePhonePage
  },  {
    path: 'change-phone-2',
    loadChildren: () => import('./change-phone-2/change-phone-2.module').then( m => m.ChangePhone2PageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePhonePageRoutingModule {}
