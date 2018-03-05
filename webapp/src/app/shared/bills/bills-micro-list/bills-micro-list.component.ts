import { BillModel, BillsUtils } from '../../bills-utils';
import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { Bill } from '@app/entities';
import * as moment from 'moment';

@Component({
  selector: 'app-bills-micro-list',
  templateUrl: './bills-micro-list.component.html',
  styleUrls: ['./bills-micro-list.component.scss']
})
export class BillsMicroListComponent implements OnChanges {

  @Input() bills: Bill[];
  // private _bills: Bill[];
  @Output() gotobill = new EventEmitter<BillModel>();

  data: BillModel[];

  _showFull = false;

  _showUnpaid = false;

  _showPending = false;

  minBound: number;
  minDate: number;
  maxBound: number;
  maxDate: number;

  billsPeriodFilterFn = (b: Bill) => true;

  constructor() { }

  ngOnChanges() {
    this.bills.sort(BillsUtils.sortBillsFn); // bills should be sorted first
    this.initDates(); // inits the bound dates
    this.initBillsPeriodFilterFn(); // inits the period filter
    this.setDataSource(this.full);
  }

  initDates() {
    const size = this.bills.length;
    if (size > 0) {
      this.minDate = this.minBound = this.bills[size - 1].deliveryDate; // the last one is the oldest one
      this.maxDate = this.maxBound = this.bills[0].deliveryDate; // the first one is the most recent
    }
  }

  initBillsPeriodFilterFn() {
    if (this.bills.length > 0) {
      this.billsPeriodFilterFn = (b: Bill) => (
        (moment(b.deliveryDate).isSameOrAfter(moment(this.minDate))
          && moment(b.deliveryDate).isSameOrBefore(moment(this.maxDate)))
        || (!!b.paymentDate
          && moment(b.paymentDate).isSameOrAfter(moment(this.minDate))
          && moment(b.paymentDate).isSameOrBefore(moment(this.maxDate))
        )
      );
    }
  }

  setDataSource(bills: Bill[]) {
    this.data = bills.filter(this.billsPeriodFilterFn).map(bill => new BillModel(bill));
  }

  get full(): Bill[] {
    return this.bills.sort(BillsUtils.sortBillsFn);
  }

  get unpaid(): Bill[] {
    return this.bills.sort(BillsUtils.sortBillsFn)
      .filter(BillsUtils.isUnPaid);
  }

  get pending(): Bill[] {
    return this.bills.sort(BillsUtils.sortBillsFn)
      .filter(BillsUtils.isPending);
  }

  get showFull(): boolean {
    return this._showFull && !this.billsIsEmpty();
  }

  get showUnpaid(): boolean {
    return this._showUnpaid && !this.billsIsEmpty();
  }

  get showPending(): boolean {
    return this._showPending && !this.billsIsEmpty();
  }

  set showFull(value: boolean) {
    this._showFull = value;
    if (this._showFull) {
      this._showUnpaid = this._showPending = !this._showFull;
      this.setDataSource(this.full);
    }
  }

  set showUnpaid(value: boolean) {
    this._showUnpaid = value;
    if (this._showUnpaid) {
      this._showFull = this._showPending = !this._showUnpaid;
      this.setDataSource(this.unpaid);
    }
  }

  set showPending(value: boolean) {
    this._showPending = value;
    if (this._showPending) {
      this._showFull = this._showUnpaid = !this.showPending;
      this.setDataSource(this.pending);
    }
  }

  billsIsEmpty(): boolean {
    return this.bills.length === 0;
  }

  gotoBill(bill: BillModel) {
    this.gotobill.emit(bill);
  }

  updateMinDate(minDate: number) {
    if (this.minDate !== minDate) {
      this.minDate = minDate;
      this.initBillsPeriodFilterFn();
      this.updateCurrentModel();
    }
  }

  updateMaxDate(maxDate: number) {
    if (this.maxDate !== maxDate) {
      this.maxDate = maxDate;
      this.initBillsPeriodFilterFn();
      this.updateCurrentModel();
    }
  }

  private updateCurrentModel() {
    // keep the current view updated
    this.showFull = this._showFull;
    this.showUnpaid = this._showUnpaid;
    this.showPending = this._showPending;
  }
}


