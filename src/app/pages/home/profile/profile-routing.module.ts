import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'delete-account',
    loadChildren: () => import('./delete-account/delete-account.module').then( m => m.ExcludeAccountPageModule)
  },
  {
    path: 'change-email',
    loadChildren: () => import('./change-email/change-email.module').then( m => m.ChangeEmailPageModule)
  },
  {
    path: 'change-phone',
    loadChildren: () => import('./change-phone/change-phone.module').then( m => m.ChangePhonePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ProfilePageRoutingModule {}