import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExcludeAccountPage } from './delete-account.page';

const routes: Routes = [
  {
    path: '',
    component: ExcludeAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExcludeAccountPageRoutingModule {}
