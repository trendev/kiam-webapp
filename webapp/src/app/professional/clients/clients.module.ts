import { BillsMicroListTableComponent } from './bills-micro-list-table/bills-micro-list-table.component';
import { MatPaginatorIntl } from '@angular/material';
import { NgModule } from '@angular/core';

import { ClientsRoutingModule } from './clients-routing.module';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { ClientsComponent } from './clients/clients.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { ClientDetailResolverService } from './client-detail-resolver.service';
import { ClientBillsResolverService } from './client-bills-resolver.service';
import { ClientBillsListComponent } from './client-bills-list/client-bills-list.component';

@NgModule({
  imports: [
    SharedModule,
    ClientsRoutingModule
  ],
  declarations: [ClientsComponent, CreateClientComponent, ClientDetailComponent, ClientBillsListComponent, BillsMicroListTableComponent],
  providers: [
    ClientDetailResolverService,
    ClientBillsResolverService,
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr }
  ],
})
export class ClientsModule { }
