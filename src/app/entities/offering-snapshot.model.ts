import { Business } from './business.model';

export abstract class OfferingSnapshot {
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
