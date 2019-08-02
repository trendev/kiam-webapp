import { StripePlan } from '@app/entities';
import { StripeCustomer } from './stripe-customer.model';

export class AmountHelper {

    static computeBaseAmount(customer: StripeCustomer, plan: StripePlan): number {
        return plan.amount * (100 + customer.subscription.tax_percent) / 100;
    }

    static computeAmount(customer: StripeCustomer, plan: StripePlan): number {
        return (AmountHelper.computeBaseAmount(customer, plan) * (100 - customer.subscription.discount_percent_off) / 100);
    }
}
