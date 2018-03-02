import { GroupsComponent } from './groups/groups.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';
import { CollectiveGroupsResolverService } from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    pathMatch: 'full',
    resolve: {
      collectiveGroups: CollectiveGroupsResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
