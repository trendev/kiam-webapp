import { Component, Input } from '@angular/core';
import { StripeCustomer } from '@app/professional/profile/subscription-details/stripe-customer.model';

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

  constructor() { }

  get discount_applied(): boolean {
    return this.customer.subscription.discount_applied;
  }

  get baseAmount(): number {
    return this.customer.subscription.amount * (100 + this.customer.subscription.tax_percent) / 100;
  }

  get amount(): number {
    return (this.baseAmount * (100 - this.customer.subscription.discount_percent_off) / 100);
  }

}
