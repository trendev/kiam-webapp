import { PaymentMode } from './payment-mode.model';

export class Payment {
    id: string;
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
