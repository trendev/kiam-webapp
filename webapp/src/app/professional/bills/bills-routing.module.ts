import { CollectiveGroupBillResolverService } from './collective-group-bill-resolver.service';
import { CollectiveGroupBillDetailComponent } from './collective-group-bill-detail/collective-group-bill-detail.component';
import { CreateCollectiveGroupBillComponent } from './create-collective-group-bill/create-collective-group-bill.component';
import { ClientBillResolverService } from './client-bill-resolver.service';
import { ClientBillDetailComponent } from './client-bill-detail/client-bill-detail.component';
import { CreateClientBillComponent } from './create-client-bill/create-client-bill.component';
import {
  OfferingsResolverService,
  ProfessionalPaymentModesResolverService,
  ProfessionalBillsRefDateResolverService,
  ProfessionalBillsResolverService
} from '@app/core';
import { BillsComponent } from './bills/bills.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';

const routes: Routes = [
  {
    path: '',
    component: BillsComponent,
    pathMatch: 'full',
    resolve: {
      bills: ProfessionalBillsResolverService
    }
  },
  {
    path: 'create-clientbill',
    component: CreateClientBillComponent,
    resolve: {
      offerings: OfferingsResolverService,
      paymentModes: ProfessionalPaymentModesResolverService,
      billsRefDate: ProfessionalBillsRefDateResolverService
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
  {
    path: 'create-collectivegroupbill',
    component: CreateCollectiveGroupBillComponent,
    resolve: {
      offerings: OfferingsResolverService,
      paymentModes: ProfessionalPaymentModesResolverService,
      billsRefDate: ProfessionalBillsRefDateResolverService
    }
  },
  {
    path: 'collectivegroupbill',
    component: CollectiveGroupBillDetailComponent,
    resolve: {
      paymentModes: ProfessionalPaymentModesResolverService,
      collectiveGroupBill: CollectiveGroupBillResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }
