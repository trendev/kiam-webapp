import { StripeInvoicesResolverService } from './stripe-invoices-resolver.service';
import { StripeCustomerResolverService } from './stripe-customer-resolver.service';
import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '@app/shared';
import { ChangeProfessionalPasswordComponent } from './change-professional-password/change-professional-password.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { SubscriptionAmountComponent } from './subscription-details/subscription-amount/subscription-amount.component';
import { SourceDetailsComponent } from './subscription-details/source-details/source-details.component';
import { StripeInvoicesComponent } from './stripe-invoices/stripe-invoices.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent,
    ChangeProfessionalPasswordComponent,
    SubscribeComponent,
    SubscriptionDetailsComponent,
    SubscriptionAmountComponent,
    SourceDetailsComponent,
    StripeInvoicesComponent
  ],
  providers: [
    StripeCustomerResolverService,
    StripeInvoicesResolverService
  ]
})
export class ProfileModule { }
