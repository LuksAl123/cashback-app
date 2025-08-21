import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChangeEmail2Page } from './change-email-2.page';

const routes: Routes = [
  {
    path: '',
    component: ChangeEmail2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangeEmail2PageRoutingModule {}
