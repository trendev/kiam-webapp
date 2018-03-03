import { CollectiveGroupsRoutingModule } from './collective-groups-routing.module';
import { NgModule } from '@angular/core';

import { GroupsComponent } from './groups/groups.component';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { MatPaginatorIntl } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    CollectiveGroupsRoutingModule
  ],
  declarations: [GroupsComponent],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr }
  ],
})
export class CollectiveGroupsModule { }
