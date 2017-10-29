export class PaymentMode {
    name: string;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): PaymentMode {
        return new PaymentMode(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
