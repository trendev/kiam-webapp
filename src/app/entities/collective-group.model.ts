import { Address } from './address.model';

export class CollectiveGroup {
    id: string;
    groupName: string;
    phone: string;
    address: Address;

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): CollectiveGroup {
        return new CollectiveGroup(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
