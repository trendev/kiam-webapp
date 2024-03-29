import { Business } from './business.model';

export class OfferingType {
    public static readonly SERVICE = 'service';
    public static readonly PACK = 'pack';
}

export abstract class Offering {
    id: string;
    cltype: string;
    name: string;
    shortname: string;
    price: number;
    duration: number;
    businesses: Business[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
