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
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CollectiveGroupsRoutingModule { }
