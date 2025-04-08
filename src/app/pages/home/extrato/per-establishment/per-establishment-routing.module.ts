import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerEstablishmentPage } from './per-establishment.page';

const routes: Routes = [
  {
    path: '',
    component: PerEstablishmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerEstablishmentPageRoutingModule {}
