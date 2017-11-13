import { NgModule } from '@angular/core';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups/groups.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    SharedModule,
    GroupsRoutingModule
  ],
  declarations: [GroupsComponent]
})
export class GroupsModule { }
