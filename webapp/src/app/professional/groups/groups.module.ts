import { NgModule } from '@angular/core';

import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups/groups.component';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { MatPaginatorIntl } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    GroupsRoutingModule
  ],
  declarations: [GroupsComponent],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr }
  ],
})
export class GroupsModule { }
