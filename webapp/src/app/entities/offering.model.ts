import { Business } from './business.model';

export class OfferingType {
    public static SERVICE = 'service';
    public static PACK = 'pack';
}

export abstract class Offering {
    id: number;
    cltype: string;
    name: string;
    price: number;
    duration: number;
    hidden: boolean;
    businesses: Business[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
