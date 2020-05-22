import { Component, OnChanges, Input } from '@angular/core';
import { Bill } from '@app/entities';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;
import { BillsUtils, VatAmount } from '@app/shared';

@Component({
  selector: 'app-revenues-sumup',
  templateUrl: './revenues-sumup.component.html',
  styleUrls: ['./revenues-sumup.component.scss']
})
export class RevenuesSumupComponent implements OnChanges {

  @Input() bills: Bill[];

  currentMonthRevenue = 0;
  previousMonthRevenue = 0;

  currentMonthVATAmounts: VatAmount[];
  previousMonthVATAmounts: VatAmount[];

  constructor() { }

  ngOnChanges() {
    this.initRevenues();
  }

  initRevenues() {
    this.currentMonthRevenue = this.currentMonthBills.map(b => BillsUtils.getRevenue(b)).reduce((a, b) => a + b, 0);
    this.previousMonthRevenue = this.previousMonthBills.map(b => BillsUtils.getRevenue(b)).reduce((a, b) => a + b, 0);

    this.currentMonthVATAmounts = BillsUtils.reduceVATAmounts(this.currentMonthBills);
    this.previousMonthVATAmounts = BillsUtils.reduceVATAmounts(this.previousMonthBills);
  }

  private get currentMonthBills(): Bill[] {
    return this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().startOf('month'))
        && moment(b.paymentDate).isSameOrBefore(moment()));
  }

  private get previousMonthBills(): Bill[] {
    return this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().startOf('month').subtract(1, 'month'))
        && moment(b.paymentDate).isSameOrBefore(moment().startOf('month').subtract(1, 'month').endOf('month')));
  }

  getTaxBase(va: VatAmount): number {
    return BillsUtils.getTaxBase(va);
  }
}
