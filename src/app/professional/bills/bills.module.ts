import { MatPaginatorIntl } from '@angular/material/paginator';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { NgModule } from '@angular/core';

import { BillsRoutingModule } from './bills-routing.module';
import { BillsComponent } from './bills/bills.component';
import { CreateBillComponent } from './create-bill/create-bill.component';
import { CreateClientBillComponent } from './create-client-bill/create-client-bill.component';
import { PurchasedOfferingsComponent } from './purchased-offerings/purchased-offerings.component';
import { InformationComponent } from './information/information.component';
import { PaymentsComponent } from './payments/payments.component';
import { ClientBillResolverService } from './client-bill-resolver.service';
import { ClientBillDetailComponent } from './client-bill-detail/client-bill-detail.component';
import { BillDetailComponent } from './bill-detail/bill-detail.component';
import { FixedPurchasedOfferingsComponent } from './fixed-purchased-offerings/fixed-purchased-offerings.component';
import { FixedPaymentsComponent } from './fixed-payments/fixed-payments.component';
import { RevenuesSumupComponent } from './revenues-sumup/revenues-sumup.component';
import { PaymentModeSelectorComponent } from './payment-mode-selector/payment-mode-selector.component';
import { BillsTableComponent } from './bills-table/bills-table.component';
import { CreateCollectiveGroupBillComponent } from './create-collective-group-bill/create-collective-group-bill.component';
import { CollectiveGroupBillDetailComponent } from './collective-group-bill-detail/collective-group-bill-detail.component';
import { CollectiveGroupBillResolverService } from './collective-group-bill-resolver.service';
import { ExportBillService } from './export-bill.service';
import { AmountDetailComponent } from './bill-detail/amount-detail/amount-detail.component';

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
    PaymentsComponent,
    ClientBillDetailComponent,
    BillDetailComponent,
    FixedPurchasedOfferingsComponent,
    FixedPaymentsComponent,
    RevenuesSumupComponent,
    PaymentModeSelectorComponent,
    BillsTableComponent,
    CreateCollectiveGroupBillComponent,
    CollectiveGroupBillDetailComponent,
    AmountDetailComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr },
    ClientBillResolverService,
    CollectiveGroupBillResolverService,
    ExportBillService
  ]
})
export class BillsModule { }
