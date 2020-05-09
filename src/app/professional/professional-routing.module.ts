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
        loadChildren: () => import('app/professional/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'clients',
        loadChildren: () => import('app/professional/clients/clients.module').then(m => m.ClientsModule)
      },
      {
        path: 'bills',
        loadChildren: () => import('app/professional/bills/bills.module').then(m => m.BillsModule)
      },
      {
        path: 'expenses',
        loadChildren: () => import('app/professional/expenses/expenses.module').then(m => m.ExpensesModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('app/professional/categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'collective-groups',
        loadChildren: () => import('app/professional/collective-groups/collective-groups.module').then(m => m.CollectiveGroupsModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('app/professional/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'offerings',
        loadChildren: () => import('app/professional/offerings/offerings.module').then(m => m.OfferingsModule)
      },
      { path: '', redirectTo: 'bills', pathMatch: 'full' },
      { path: '**', component: PageNotFoundComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalRoutingModule { }
