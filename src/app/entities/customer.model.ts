import { SocialNetworkAccounts } from './social-network-accounts.model';
import { Address } from './address.model';
import { CustomerDetails } from './customer-details.model';
import { UserAccount } from './user-account.model';

export abstract class Customer extends UserAccount {

    customerDetails: CustomerDetails;
    address: Address;
    socialNetworkAccounts: SocialNetworkAccounts;

    constructor(values: Object = {}) {
        super(values);
    }

    toString(): string {
        return JSON.stringify(this);
    }
}
