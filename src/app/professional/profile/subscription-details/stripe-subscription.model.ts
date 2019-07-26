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

    static build(inputSub: any): StripeSubscription {
        return new StripeSubscription({
            id: inputSub.id,
            billing_cycle_anchor: inputSub.billing_cycle_anchor,
            cancel_at_period_end: inputSub.cancel_at_period_end,
            canceled_at: inputSub.canceled_at,
            created: inputSub.created,
            current_period_end: inputSub.current_period_end,
            current_period_start: inputSub.current_period_start,
            nickname: inputSub.plan.nickname,
            amount: inputSub.plan.amount,
            tax_percent: inputSub.default_tax_rates[0].percentage,
            discount_applied: !!inputSub.discount,
            discount_percent_off: inputSub.discount ? inputSub.discount.coupon.percent_off : undefined
        });
    }

    copy(): StripeSubscription {
        return Object.assign({}, this);
    }

}
