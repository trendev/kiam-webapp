import { CollectiveGroupsRoutingModule } from './collective-groups-routing.module';
import { NgModule } from '@angular/core';

import { CollectiveGroupsComponent } from './collective-groups/collective-groups.component';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { CreateCollectiveGroupComponent } from './create-collective-group/create-collective-group.component';
import { CollectiveGroupDetailComponent } from './collective-group-detail/collective-group-detail.component';
import { CollectiveGroupDetailResolverService } from './collective-group-detail-resolver.service';
import { CollectiveGroupBillsResolverService } from './collective-group-bills-resolver.service';
import { RecipientDialogComponent } from './recipient-dialog/recipient-dialog.component';

@NgModule({
  imports: [
    SharedModule,
    CollectiveGroupsRoutingModule
  ],
  declarations: [
    CollectiveGroupsComponent,
    CreateCollectiveGroupComponent,
    CollectiveGroupDetailComponent,
    RecipientDialogComponent
  ],
  providers: [
    CollectiveGroupDetailResolverService,
    CollectiveGroupBillsResolverService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr }
  ],
})
export class CollectiveGroupsModule { }
