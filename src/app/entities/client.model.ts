import { Category } from './category.model';
import { CollectiveGroup } from './collective-group.model';
import { CustomerDetails } from './customer-details.model';
import { SocialNetworkAccounts } from './social-network-accounts.model';
import { Address } from './address.model';

export class Client {
    id: number;
    email: string;
    socialNetworkAccounts: SocialNetworkAccounts;
    customerDetails: CustomerDetails;
    address: Address;
    categories: Category[];

    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

    copy(): Client {
        return new Client(this);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
