import { OfferingsResolverService, ProfessionalPaymentModesResolverService } from '@app/core';
import { CreateBillComponent } from './create-bill/create-bill.component';
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
    component: CreateBillComponent,
    resolve: {
      offerings: OfferingsResolverService,
      paymentModes: ProfessionalPaymentModesResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillsRoutingModule { }
