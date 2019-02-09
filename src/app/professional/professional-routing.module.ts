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
        path: 'dashboard',
        loadChildren: 'app/professional/dashboard/dashboard.module#DashboardModule'
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
        path: 'collective-groups',
        loadChildren: 'app/professional/collective-groups/collective-groups.module#CollectiveGroupsModule'
      },
      {
        path: 'profile',
        loadChildren: 'app/professional/profile/profile.module#ProfileModule'
      },
      {
        path: 'offerings',
        loadChildren: 'app/professional/offerings/offerings.module#OfferingsModule'
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
