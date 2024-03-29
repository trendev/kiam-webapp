import { StripeSubscription } from './stripe-subscription.model';

export class StripeCustomer {

    public id: string;
    public created: number;
    public default_payment_method: string;
    public subscription: StripeSubscription;

    constructor(values: Object = {}) {
        Object.assign(this, values);
        this.created = StripeSubscription.convertIntoMilliseconds(this.created);
    }

    static build(inputCust: any): StripeCustomer {

        const inputSub = inputCust.subscriptions.data[0];

        return new StripeCustomer({
            id: inputCust.id,
            created: inputCust.created,
            default_payment_method: inputCust.invoice_settings.default_payment_method,
            subscription: StripeSubscription.build(inputSub),
        });
    }

    copy(): StripeCustomer {
        return Object.assign({}, this);
    }

}
