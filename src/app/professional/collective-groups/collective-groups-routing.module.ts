import { CollectiveGroupBillsResolverService } from './collective-group-bills-resolver.service';
import { CollectiveGroupDetailResolverService } from './collective-group-detail-resolver.service';
import { CollectiveGroupDetailComponent } from './collective-group-detail/collective-group-detail.component';
import { CreateCollectiveGroupComponent } from './create-collective-group/create-collective-group.component';
import { CollectiveGroupsComponent } from './collective-groups/collective-groups.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';
import { CollectiveGroupsResolverService } from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: CollectiveGroupsComponent,
    pathMatch: 'full',
    resolve: {
      collectiveGroups: CollectiveGroupsResolverService
    }
  },
  {
    path: 'create-collective-group',
    component: CreateCollectiveGroupComponent,
  },
  {
    path: ':id',
    component: CollectiveGroupDetailComponent,
    resolve: {
      collectiveGroup: CollectiveGroupDetailResolverService,
      collectiveGroupBills: CollectiveGroupBillsResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectiveGroupsRoutingModule { }
