import { ClientBillResolverService } from './client-bill-resolver.service';
import { ClientBillDetailComponent } from './client-bill-detail/client-bill-detail.component';
import { CreateClientBillComponent } from './create-client-bill/create-client-bill.component';
import {
  OfferingsResolverService,
  ProfessionalPaymentModesResolverService,
  ProfessionalBilllsRefDateResolverService
} from '@app/core';
import { BillsComponent } from './bills/bills.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: BillsComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-clientbill',
    component: CreateClientBillComponent,
    resolve: {
      offerings: OfferingsResolverService,
      paymentModes: ProfessionalPaymentModesResolverService,
      billsRefDate: ProfessionalBilllsRefDateResolverService
    }
  },
  {
    path: 'clientbill',
    component: ClientBillDetailComponent,
    resolve: {
      paymentModes: ProfessionalPaymentModesResolverService,
      clientBill: ClientBillResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }
