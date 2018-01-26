import { Component, OnChanges, Input } from '@angular/core';
import { Bill } from '@app/entities';
import * as moment from 'moment';

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

  constructor() { }

  ngOnChanges() {
    this.initRevenues();
  }

  initRevenues() {

    this.currentMonthRevenue = this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().startOf('month'))
        && moment(b.paymentDate).isSameOrBefore(moment()))
      .map(b => b.amount)
      .reduce((a, b) => a + b, 0);

    this.previousMonthRevenue = this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().startOf('month').subtract(1, 'month'))
        && moment(b.paymentDate).isSameOrBefore(moment().startOf('month').subtract(1, 'month').endOf('month')))
      .map(b => b.amount)
      .reduce((a, b) => a + b, 0);

    this.currentWeekRevenue = this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().locale('fr').startOf('week'))
        && moment(b.paymentDate).isSameOrBefore(moment()))
      .map(b => b.amount)
      .reduce((a, b) => a + b, 0);

    this.previousWeekRevenue = this.bills
      .filter(b => !!b.paymentDate)
      .filter(b => moment(b.paymentDate).isSameOrAfter(moment().locale('fr').startOf('week').subtract(1, 'week'))
        && moment(b.paymentDate).isBefore(moment().locale('fr').startOf('week')))
      .map(b => b.amount)
      .reduce((a, b) => a + b, 0);
  }

}
