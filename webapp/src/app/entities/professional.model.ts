import { PaymentMode } from './payment-mode.model';
import { Business } from './business.model';
import { UserAccountType } from './user-account.model';
import { Customer } from './customer.model';

export class Professional extends Customer {

    website: string;
    companyName: string;
    companyID: string;
    vatcode: string;
    creationDate: number;
    businesses: Business[];
    paymentModes: PaymentMode[];

    constructor(values: Object = {}) {
        super(values);
        this.cltype = UserAccountType.PROFESSIONAL;
    }

    copy(): Professional {
        return new Professional(this);
    }
}
