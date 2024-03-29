import { AmountHelper } from './../amount-helper';
import { MomentJSHelper } from './../../moment-js-helper';
import { Component, Input } from '@angular/core';
import { StripeCustomer } from '@app/professional/profile/subscription-details/stripe-customer.model';
import { StripePlan } from '@app/entities';

@Component({
  selector: 'app-subscription-amount',
  templateUrl: './subscription-amount.component.html',
  styleUrls: ['./subscription-amount.component.scss']
})
/**
 * Stripe provides amounts in cents (1/100) !!!
 */
export class SubscriptionAmountComponent {

  @Input() customer: StripeCustomer;
  @Input() plan: StripePlan;

  constructor() { }

  get discount_applied(): boolean {
    return this.customer.subscription.discount_applied;
  }

  get baseAmount(): number {
    return AmountHelper.computeBaseAmount(this.customer, this.plan);
  }

  get amount(): number {
    return AmountHelper.computeAmount(this.customer, this.plan);
  }

  get displayRenewalUnit(): string {
    return MomentJSHelper.displayRenewalUnit(this.plan);
  }

}
