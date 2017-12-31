import { PurchasedOffering } from './purchased-offering.model';
import { Payment } from './payment.model';

export class BillType {
    public static readonly COLLECTIVE_GROUP_BILL = 'collectivegroupbill';
    public static readonly CLIENT_BILL = 'clientbill';
    public static readonly INDIVIDUAL_BILL = 'individualbill';
}

export class Bill {
    reference: string;
    deliveryDate: number;
    cltype: string;
    amount: number;
    currency: string;
    discount: number;
    paymentDate: number;
    comments: string[];
    payments: Payment[];
    purchasedOfferings: PurchasedOffering[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
