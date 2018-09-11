import { StripeSource } from './stripe-source.model';
import { StripeSubscription } from './stripe-subscription.model';

export class StripeCustomer {

    constructor(
        public id: string,
        public created: number,
        public default_source: string,
        public subscription: StripeSubscription,
        public sources: StripeSource[]) {
        this.created = StripeSubscription.convertIntoMilliseconds(created);
    }

    static build(inputCust: any): StripeCustomer {

        const inputSub = inputCust.subscriptions.data[0];

        return new StripeCustomer(
          inputCust.id,
          inputCust.created,
          inputCust.default_source,
          new StripeSubscription(
            inputSub.id,
            inputSub.billing_cycle_anchor,
            inputSub.cancel_at_period_end,
            inputSub.canceled_at,
            inputSub.created,
            inputSub.current_period_end,
            inputSub.current_period_start,
            inputSub.plan.nickname,
            inputSub.plan.amount,
            inputSub.tax_percent,
            !!inputSub.discount,
            inputSub.discount ? inputSub.discount.coupon.percent_off : undefined
          ),
          inputCust.sources.data.map(s =>
            new StripeSource(
              s.id,
              s.status,
              s.type,
              s.type_data.brand,
              s.type_data.exp_month,
              s.type_data.exp_year,
              s.type_data.last4,
              s.type_data.three_d_secure,
              s.id === inputCust.default_source
            )
          )
        );
    }

    copy(): StripeCustomer {
        return Object.assign({}, this);
    }

    get baseAmount(): number {
        return this.subscription.amount * (100 + this.subscription.tax_percent) / 100;
    }

    get amount(): number {
        return (this.baseAmount * (100 - this.subscription.discount_percent_off) / 100);
    }


}
