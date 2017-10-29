import { Payment } from './payment.model';
import { Business } from './business.model';

export class Expense {
    id: number;
    name: string;
    amount: number;
    currency: string;
    paymentDate: number;
    invoiceRef: string;
    categories: string[];
    payments: Payment[];
    businesses: Business[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): Expense {
        return new Expense(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
