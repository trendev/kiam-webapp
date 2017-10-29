import { Individual } from './individual.model';
import { Bill, BillType } from './bill.model';

export class IndividualBill extends Bill {

    individual: Individual;

    constructor(values: Object = {}) {
        super(values);
        this.cltype = BillType.INDIVIDUAL_BILL;
    }

    copy(): IndividualBill {
        return new IndividualBill(this);
    }
}
