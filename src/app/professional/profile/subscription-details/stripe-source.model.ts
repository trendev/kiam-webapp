export class StripeSource {
    public id: string;
    public status: string;
    public type: string;
    public brand: string;
    public exp_month: string;
    public exp_year: string;
    public last4: string;
    public three_d_secure: string;
    public is_default: boolean;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): StripeSource {
        return Object.assign({}, this);
    }
}
