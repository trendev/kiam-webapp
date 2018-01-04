import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './bills/bills.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { CreateClientBillComponent } from './create-client-bill/create-client-bill.component';
import { PurchasedOfferingsComponent } from './purchased-offerings/purchased-offerings.component';
import { InformationComponent } from './information/information.component';
import { PaymentsComponent } from './payments/payments.component';
import { ClientBillResolverService } from './client-bill-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    BillsRoutingModule
  ],
  declarations: [
    BillsComponent,
    CreateBillComponent,
    CreateClientBillComponent,
    PurchasedOfferingsComponent,
    InformationComponent,
    PaymentsComponent
  ],
  providers: [ClientBillResolverService]
})
export class BillsModule { }
