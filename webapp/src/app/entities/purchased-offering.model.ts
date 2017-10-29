import { Offering } from './offering.model';

export class PurchasedOffering {
    id: number;
    qty: number;
    price: number;
    offering: Offering;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): PurchasedOffering {
        return new PurchasedOffering(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
