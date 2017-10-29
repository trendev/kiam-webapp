import { CollectiveGroup } from './collective-group.model';
import { Bill, BillType } from './bill.model';

export class CollectiveGroupBill extends Bill {

    collectiveGroup: CollectiveGroup;

    constructor(values: Object = {}) {
        super(values);
        this.cltype = BillType.COLLECTIVE_GROUP_BILL;
    }

    copy(): CollectiveGroupBill {
        return new CollectiveGroupBill(this);
    }
}
