import { VatAmount } from '@app/shared';
import { Bill, ClientBill, CollectiveGroupBill, IndividualBill, BillType, PurchasedOffering } from '@app/entities';
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

    /**
     * Returns the bill's amount : if the bill has taxes, computes the total price from the prices of the offering snapshots.
     * Otherwise returns the total amount.
     * @param bill the bill
     */
    static getAmount(bill: Bill): number {
        return bill.vatInclusive
            ? bill.purchasedOfferings.map(po => po.qty * po.offeringSnapshot.price).reduce((a, b) => a + b, 0) - bill.discount
            : bill.amount;
    }

    /**
     * Get the VAT amounts of the bill. Returns an empty array if the bill has no VAT
     * @param bill the bill
     */
    static getVATAmounts(bill: Bill): VatAmount[] {
        const vatAmounts: VatAmount[] = [];

        if (bill.vatInclusive) {
            bill.purchasedOfferings.forEach(po => {
                const index = vatAmounts.findIndex(va => po.vatRate === va.rate);
                if (index !== -1) {
                    vatAmounts[index].amount += BillsUtils.getVATAmount(po);
                } else {
                    vatAmounts.push({
                        rate: po.vatRate,
                        amount: BillsUtils.getVATAmount(po)
                    });
                }
            });
            return vatAmounts;
        }

        return vatAmounts;
    }

    /**
     * Computes the total VAT Amount of a Purchased Offering
     * @param po the purchased offering
     */
    private static getVATAmount(po: PurchasedOffering): number {
        return po.qty * Math.round((po.offeringSnapshot.price * po.vatRate) / 100);
    }

    /**
     * Reduce a bill list to a set of VAT Amount
     * @param bills the bills
     */
    static reduceVATAmounts(bills: Bill[]): VatAmount[] {
        const vatAmounts = Object.values(bills.filter(b => b.vatInclusive)
            .map(b => BillsUtils.getVATAmounts(b))
            .reduce((map, vas) => {
                vas.forEach(va => {
                    if (map[va.rate]) {
                        map[va.rate].amount += va.amount;
                    } else {
                        map[va.rate] = va;
                    }
                });
                return map;
            }, {})) as VatAmount[];
        return vatAmounts.sort(VatAmountDescSortFn);
    }

    static getTaxBase(va: VatAmount): number {
        return (va.amount * 100) / va.rate;
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
        this.amount = BillsUtils.getAmount(bill);
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

export interface VatAmount {
    rate: number;
    amount: number;
}

export const VatAmountDescSortFn =
    (va1: VatAmount, va2: VatAmount) => va2.rate - va1.rate;
