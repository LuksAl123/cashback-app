import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtratoPage } from './extrato.page';

const routes: Routes = [
  {
    path: '',
    component: ExtratoPage
  },  {
    path: 'per-establishment',
    loadChildren: () => import('./per-establishment/per-establishment.module').then( m => m.PerEstablishmentPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtratoPageRoutingModule {}
