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
    return this.customer.baseAmount;
  }

  get amount(): number {
    return this.customer.amount;
  }

  // TODO : complete using a moment.js helper
  displayRenewalUnit(): string {
    return 'interval';
  }

}
