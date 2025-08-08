import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CashbackPage } from './cashback.page';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: CashbackPage
      },
      {
        path: 'establishment',
        loadChildren: () => import('./establishment/establishment.module').then( m => m.EstablishmentPageModule)
      },
    ], { bindToComponentInputs: true })
  ],
  exports: [RouterModule],
})

export class CashbackPageRoutingModule {}