import { StripeSource } from './stripe-source.model';
import { StripeSubscription } from './stripe-subscription.model';

export class StripeCustomer {

    public id: string;
    public created: number;
    public default_source: string;
    public subscription: StripeSubscription;
    public sources: StripeSource[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
        this.created = StripeSubscription.convertIntoMilliseconds(this.created);
    }

    static build(inputCust: any): StripeCustomer {

        const inputSub = inputCust.subscriptions.data[0];

        return new StripeCustomer({
            id: inputCust.id,
            created: inputCust.created,
            default_source: inputCust.default_source,
            subscription: new StripeSubscription({
                id: inputSub.id,
                billing_cycle_anchor: inputSub.billing_cycle_anchor,
                cancel_at_period_end: inputSub.cancel_at_period_end,
                canceled_at: inputSub.canceled_at,
                created: inputSub.created,
                current_period_end: inputSub.current_period_end,
                current_period_start: inputSub.current_period_start,
                nickname: inputSub.plan.nickname,
                amount: inputSub.plan.amount,
                tax_percent: inputSub.tax_percent,
                discount_applied: !!inputSub.discount,
                discount_percent_off: inputSub.discount ? inputSub.discount.coupon.percent_off : undefined
            }),
            sources: inputCust.sources.data.map(s =>
                new StripeSource({
                    id: s.id,
                    status: s.status,
                    type: s.type,
                    brand: s.type_data.brand,
                    exp_month: s.type_data.exp_month,
                    exp_year: s.type_data.exp_year,
                    last4: s.type_data.last4,
                    three_d_secure: s.type_data.three_d_secure,
                    is_default: s.id === inputCust.default_source
                }
                )
            )
        }
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
