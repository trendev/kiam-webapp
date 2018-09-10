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

    copy(): StripeCustomer {
        return Object.assign({}, this);
    }
}
