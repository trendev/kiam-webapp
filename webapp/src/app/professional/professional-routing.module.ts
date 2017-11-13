import { WelcomeComponent } from './welcome/welcome/welcome.component';
import { ProfessionalGuard } from './professional.guard';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalDashboardComponent,
    canActivate: [ProfessionalGuard],
    children: [
      {
        path: 'welcome',
        loadChildren: 'app/professional/welcome/welcome.module#WelcomeModule'
      },
      {
        path: 'clients',
        loadChildren: 'app/professional/clients/clients.module#ClientsModule'
      },
      {
        path: 'bills',
        loadChildren: 'app/professional/bills/bills.module#BillsModule'
      },
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
