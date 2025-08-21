import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangePhone2Page } from './change-phone-2.page';

const routes: Routes = [
  {
    path: '',
    component: ChangePhone2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePhone2PageRoutingModule {}
