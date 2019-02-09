import { AdministratorGuard } from './administrator.guard';
import { AdministratorComponent } from './administrator/administrator.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AdministratorComponent,
    canActivate: [AdministratorGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratorRoutingModule { }
