export class StripeSubscription {

    public id: string;
    public billing_cycle_anchor: number;
    public cancel_at_period_end: boolean;
    public canceled_at: number;
    public created: number;
    public current_period_end: number;
    public current_period_start: number;
    public nickname: string;
    public amount: number;
    public tax_percent: number;
    public discount_applied: boolean;
    public discount_percent_off: number;

    constructor(values: Object = {}) {
        Object.assign(this, values);
        this.billing_cycle_anchor = StripeSubscription.convertIntoMilliseconds(this.billing_cycle_anchor);
        this.canceled_at = StripeSubscription.convertIntoMilliseconds(this.canceled_at);
        this.created = StripeSubscription.convertIntoMilliseconds(this.created);
        this.current_period_end = StripeSubscription.convertIntoMilliseconds(this.current_period_end);
        this.current_period_start = StripeSubscription.convertIntoMilliseconds(this.current_period_start);

    }

    // converts epoch time into milliseconds
    static convertIntoMilliseconds(value: number) {
        return value ? value * 1000 : undefined;
    }

    copy(): StripeSubscription {
        return Object.assign({}, this);
    }

}
