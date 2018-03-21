import { VatRates } from './vat-rates.model';
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
    billsCount: number; // cannot be directly edited (ignored during a POST/PUT)
    billsRefDate: number; // cannot be directly edited (ignored during a POST/PUT)
    businesses: Business[];
    paymentModes: PaymentMode[];
    vatRates: VatRates; // init during a POST/PUT if vatcode is provided

    constructor(values: Object = {}) {
        super(values);
        this.cltype = UserAccountType.PROFESSIONAL;
    }

    copy(): Professional {
        return new Professional(this);
    }
}
