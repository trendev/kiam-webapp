import { Offering } from './offering.model';
import { OfferingSnapshot } from './offering-snapshot.model';

export class PurchasedOffering {
    id: number;
    qty: number;
    vatRate: number;
    offeringSnapshot: OfferingSnapshot;
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
