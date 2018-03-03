import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ClientBill, Client, Bill } from '@app/entities';
import * as moment from 'moment';
import { BillsUtils, BillStatus, BillModel } from '@app/shared';

@Component({
  selector: 'app-client-bills-list',
  templateUrl: './client-bills-list.component.html',
  styleUrls: ['./client-bills-list.component.scss']
})
export class ClientBillsListComponent implements OnInit {

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

  // inverse order : most recent first
  sortFn(b1: Bill, b2: Bill): number {
    const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
    return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
  }

  setDataSource(bills: Bill[]) {
    this.data = bills.map(bill => new BillModel(bill));
  }

  get full(): Bill[] {
    return this.bills.sort(this.sortFn);
  }

  get unpaid(): Bill[] {
    return this.bills.sort(this.sortFn)
      .filter(BillsUtils.isUnPaid);
  }

  get pending(): Bill[] {
    return this.bills.sort(this.sortFn)
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

  gotoClientBill(bill: BillModel) {
    this.gotobill.emit(bill);
  }
}


