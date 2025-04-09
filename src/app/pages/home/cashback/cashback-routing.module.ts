import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CashbackPage } from './cashback.page';

const routes: Routes = [
  {
    path: '',
    component: CashbackPage
  },  {
    path: 'establishment',
    loadChildren: () => import('./establishment/establishment.module').then( m => m.EstablishmentPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashbackPageRoutingModule {}
