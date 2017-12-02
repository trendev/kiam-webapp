import { ChangeProfessionalPasswordComponent } from './change-professional-password/change-professional-password.component';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    pathMatch: 'full'
  },
  {
    path: 'change-password',
    component: ChangeProfessionalPasswordComponent
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
