import { StripeInvoicesResolverService } from './stripe-invoices-resolver.service';
import { StripeInvoicesComponent } from './stripe-invoices/stripe-invoices.component';
import { StripeCustomerResolverService } from './stripe-customer-resolver.service';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { ChangeProfessionalPasswordComponent } from './change-professional-password/change-professional-password.component';
import { ProfileComponent } from './profile/profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@app/shared';
import {
  BusinessesResolverService,
  PaymentModesResolverService,
  ProfessionalProfileResolverService
} from '@app/core';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    pathMatch: 'full',
    resolve: {
      businesses: BusinessesResolverService,
      paymentModes: PaymentModesResolverService,
      pro: ProfessionalProfileResolverService
    }
  },
  {
    path: 'change-password',
    component: ChangeProfessionalPasswordComponent
  },
  {
    path: 'subscribe',
    component: SubscribeComponent
  },
  {
    path: 'subscription-details',
    component: SubscriptionDetailsComponent,
    resolve: {
      stripeCustomer: StripeCustomerResolverService
    }
  },
  {
    path: 'invoices',
    component: StripeInvoicesComponent,
    resolve: {
      stripeInvoices: StripeInvoicesResolverService
    }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
