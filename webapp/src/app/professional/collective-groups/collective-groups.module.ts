import { CollectiveGroupsRoutingModule } from './collective-groups-routing.module';
import { NgModule } from '@angular/core';

import { CollectiveGroupsComponent } from './collective-groups/collective-groups.component';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { MatPaginatorIntl } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    CollectiveGroupsRoutingModule
  ],
  declarations: [CollectiveGroupsComponent],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr }
  ],
})
export class CollectiveGroupsModule { }
