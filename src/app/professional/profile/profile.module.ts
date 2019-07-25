import { StripeInvoicesResolverService } from './stripe-invoices-resolver.service';
import { StripeCustomerResolverService } from './stripe-customer-resolver.service';
import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule, CustomMatPaginatorIntlFr } from '@app/shared';
import { ChangeProfessionalPasswordComponent } from './change-professional-password/change-professional-password.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';
import { SubscriptionAmountComponent } from './subscription-details/subscription-amount/subscription-amount.component';
import { SourceDetailsComponent } from './subscription-details/source-details/source-details.component';
import { StripeInvoicesComponent } from './stripe-invoices/stripe-invoices.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SubscriptionStatusComponent } from './subscription-details/subscription-status/subscription-status.component';
import {
  RescissionConfirmationDialogComponent
} from './subscription-details/rescission-confirmation-dialog/rescission-confirmation-dialog.component';
import { StripePaymentMethodResolver } from './stripe-payment-method-resolver.service';

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
    StripeInvoicesComponent,
    SubscriptionStatusComponent,
    RescissionConfirmationDialogComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlFr },
    StripeCustomerResolverService,
    StripeInvoicesResolverService,
    StripePaymentMethodResolver
  ],
  entryComponents: [
    RescissionConfirmationDialogComponent
  ]
})
export class ProfileModule { }
