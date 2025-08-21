import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeEmailPage } from './change-email.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeEmailPage
  },  {
    path: 'change-email-2',
    loadChildren: () => import('./change-email-2/change-email-2.module').then( m => m.ChangeEmail2PageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeEmailPageRoutingModule {}
