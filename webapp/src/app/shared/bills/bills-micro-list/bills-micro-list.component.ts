import { BillModel, BillsUtils } from '../../bills-utils';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Bill } from '@app/entities';
import * as moment from 'moment';

@Component({
  selector: 'app-bills-micro-list',
  templateUrl: './bills-micro-list.component.html',
  styleUrls: ['./bills-micro-list.component.scss']
})
export class BillsMicroListComponent implements OnInit {

  @Input() bills: Bill[];
  @Output() gotobill = new EventEmitter<BillModel>();

  data: BillModel[];

  _showFull = false;

  _showUnpaid = false;

  _showPending = false;

  constructor() { }

  ngOnInit() {
    this.setDataSource(this.full);
  }

  setDataSource(bills: Bill[]) {
    this.data = bills.map(bill => new BillModel(bill));
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
}


