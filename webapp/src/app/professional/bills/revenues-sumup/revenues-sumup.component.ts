import { Component, OnChanges, Input } from '@angular/core';
import { Bill } from '@app/entities';
import * as moment from 'moment';
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

  currentWeekRevenue = 0;
  previousWeekRevenue = 0;

  currentMonthVATAmounts: VatAmount[];
  previousMonthVATAmounts: VatAmount[];

  constructor() { }

  ngOnChanges() {
    this.initRevenues();
  }

  initRevenues() {
    this.currentMonthRevenue = this.currentMonthBills.map(b => BillsUtils.getAmount(b)).reduce((a, b) => a + b, 0);
    this.previousMonthRevenue = this.previousMonthBills.map(b => BillsUtils.getAmount(b)).reduce((a, b) => a + b, 0);
    this.currentWeekRevenue = this.currentWeekBills.map(b => BillsUtils.getAmount(b)).reduce((a, b) => a + b, 0);
    this.previousWeekRevenue = this.previousWeekBills.map(b => BillsUtils.getAmount(b)).reduce((a, b) => a + b, 0);

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

  private get currentWeekBills(): Bill[] {
    return this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().locale('fr').startOf('week'))
        && moment(b.paymentDate).isSameOrBefore(moment()));
  }

  private get previousWeekBills(): Bill[] {
    return this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().locale('fr').startOf('week').subtract(1, 'week'))
        && moment(b.paymentDate).isBefore(moment().locale('fr').startOf('week')));
  }

  getTaxBase(va: VatAmount): number {
    return BillsUtils.getTaxBase(va);
  }
}
