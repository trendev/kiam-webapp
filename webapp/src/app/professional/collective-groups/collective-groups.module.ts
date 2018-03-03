import { CollectiveGroupsRoutingModule } from './collective-groups-routing.module';
import { NgModule } from '@angular/core';

import { CollectiveGroupsComponent } from './collective-groups/collective-groups.component';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { MatPaginatorIntl } from '@angular/material';
import { CreateCollectiveGroupComponent } from './create-collective-group/create-collective-group.component';

@NgModule({
  imports: [
    SharedModule,
    CollectiveGroupsRoutingModule
  ],
  declarations: [CollectiveGroupsComponent, CreateCollectiveGroupComponent],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr }
  ],
})
export class CollectiveGroupsModule { }
