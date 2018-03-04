import { Bill, ClientBill, CollectiveGroupBill, IndividualBill, BillType } from '@app/entities';
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
            && moment(b.deliveryDate).isBefore(moment().locale('fr').subtract(2, 'week'));
    }

    static isPending(b: Bill) {
        return !b.paymentDate
            && moment(b.deliveryDate).isSameOrAfter(moment().locale('fr').subtract(2, 'week'));
    }

    static visitBill(bill: Bill, fcts: { [key: string]: () => void }) {
        switch (bill.cltype) {
            case BillType.CLIENT_BILL: {
                fcts[BillType.CLIENT_BILL]();
                break;
            }
            case BillType.COLLECTIVE_GROUP_BILL: {
                fcts[BillType.COLLECTIVE_GROUP_BILL]();
                break;
            }
            case BillType.INDIVIDUAL_BILL: {
                fcts[BillType.INDIVIDUAL_BILL]();
                break;
            }
            default:
                throw new Error(`${bill.cltype} is not a supported type of Bill`);
        }
    }

    static shrinkRef(ref: string) {
        return ref.replace(/^PRO\-[\d\w]+\-(.+)$/, '$1');
    }

    // inverse order : most recent first
    static sortBillsFn(b1: Bill, b2: Bill): number {
        const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
        return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
    }

}

export class BillStatus {
    constructor(public color: string,
        public icon: string) {
    }
}

export class BillModel {
    reference: string;
    deliveryDate: number;
    cltype: string;
    amount: number;
    currency: string;
    paymentDate: number;
    name: string;
    bill: Bill;

    constructor(bill: Bill) {
        this.reference = bill.reference;
        this.deliveryDate = bill.deliveryDate;
        this.cltype = bill.cltype;
        this.amount = bill.amount;
        this.currency = bill.currency;
        this.paymentDate = bill.paymentDate;
        this.bill = bill;
        BillsUtils.visitBill(bill,
            {
                clientbill: () => {
                    const clb = bill as ClientBill;
                    this.name = `${clb.client.customerDetails.firstName} ${clb.client.customerDetails.lastName}`;
                },
                collectivegroupbill: () => {
                    const cgb = bill as CollectiveGroupBill;
                    this.name = `${cgb.collectiveGroup.groupName}`;
                },
                individualbill: () => {
                    const ib = bill as IndividualBill;
                    this.name = `${ib.individual.customerDetails.firstName} ${ib.individual.customerDetails.lastName}`;
                },
            }
        );
    }
}
