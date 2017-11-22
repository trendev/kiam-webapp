import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent, ChangePasswordComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
