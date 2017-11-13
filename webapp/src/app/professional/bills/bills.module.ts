import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './bills/bills.component';

@NgModule({
  imports: [
    SharedModule,
    BillsRoutingModule
  ],
  declarations: [BillsComponent]
})
export class BillsModule { }
