import { WelcomeComponent } from './welcome/welcome/welcome.component';
import { ProfessionalGuard } from './professional.guard';
import { ProfessionalDashboardComponent } from './professional-dashboard/professional-dashboard.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: ProfessionalDashboardComponent,
    canActivate: [ProfessionalGuard],
    canActivateChild: [ProfessionalGuard],
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
      {
        path: 'expenses',
        loadChildren: 'app/professional/expenses/expenses.module#ExpensesModule'
      },
      {
        path: 'categories',
        loadChildren: 'app/professional/categories/categories.module#CategoriesModule'
      },
      {
        path: 'groups',
        loadChildren: 'app/professional/groups/groups.module#GroupsModule'
      },
      {
        path: 'profile',
        loadChildren: 'app/professional/profile/profile.module#ProfileModule'
      },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
