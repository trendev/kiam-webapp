import { PaymentMode } from './payment-mode.model';

export class Payment {
    id: number;
    amount: number;
    paymentMode: PaymentMode;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): Payment {
        return new Payment(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
