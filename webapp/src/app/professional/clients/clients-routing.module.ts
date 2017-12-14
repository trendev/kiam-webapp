import { ClientBillsResolverService } from './client-bills-resolver.service';
import { ClientDetailResolverService } from './client-detail-resolver.service';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { ClientsComponent } from './clients/clients.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent, LoremIpsumComponent } from '@app/shared';
import { CollectiveGroupsResolverService, CategoriesResolverService } from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: ClientsComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-client',
    component: CreateClientComponent,
    resolve: {
      collectiveGroups: CollectiveGroupsResolverService,
      categories: CategoriesResolverService
    }
  },
  {
    path: ':id',
    component: ClientDetailComponent,
    resolve: {
      client: ClientDetailResolverService,
      clientBills: ClientBillsResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
