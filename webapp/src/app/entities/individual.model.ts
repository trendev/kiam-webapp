import { UserAccountType } from './user-account.model';
import { Customer } from './customer.model';

export class Individual extends Customer {
    constructor(values: Object = {}) {
        super(values);
        this.cltype = UserAccountType.INDIVIDUAL;
    }

    copy(): Individual {
        return new Individual(this);
    }
}
