import { Bill } from '@app/entities';
import * as moment from 'moment';

export class BillsUtils {
    static getStatus(bill: Bill): BillStatus {
        if (bill.paymentDate) {
            return new BillStatus('primary', 'done_all');
        } else {
            if (this.isUnPaid(bill)) {
                return new BillStatus('warn', 'error_outline');
            }
            if (this.isPending(bill)) {
                return new BillStatus('accent', 'warning'); // warning more_horiz
            }
        }
    }

    static isUnPaid(b: Bill) {
        return !b.paymentDate
            && moment(b.deliveryDate).isBefore(moment().locale('fr').startOf('week').subtract(2, 'week'));
    }

    static isPending(b: Bill) {
        return !b.paymentDate
            && moment(b.deliveryDate).isSameOrAfter(moment().locale('fr').startOf('week').subtract(2, 'week'));
    }

}

export class BillStatus {
    constructor(public color: string,
        public icon: string) {
    }
}

