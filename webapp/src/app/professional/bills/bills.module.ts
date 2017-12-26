import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './bills/bills.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { CreateClientBillComponent } from './create-client-bill/create-client-bill.component';

@NgModule({
  imports: [
    SharedModule,
    BillsRoutingModule
  ],
  declarations: [BillsComponent, CreateBillComponent, CreateClientBillComponent]
})
export class BillsModule { }
