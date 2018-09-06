import { StripeCustomerResolverService } from './stripe-customer-resolver.service';
import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '@app/shared';
import { ChangeProfessionalPasswordComponent } from './change-professional-password/change-professional-password.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SubscriptionDetailsComponent } from './subscription-details/subscription-details.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfileComponent,
    ChangeProfessionalPasswordComponent,
    SubscribeComponent,
    SubscriptionDetailsComponent
  ],
  providers: [
    StripeCustomerResolverService
  ]
})
export class ProfileModule { }
