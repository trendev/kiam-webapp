import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { ClientBill } from '@app/entities';
import { MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client-bills-list',
  templateUrl: './client-bills-list.component.html',
  styleUrls: ['./client-bills-list.component.scss']
})
export class ClientBillsListComponent implements OnInit {

  @Input() bills: ClientBill[];

  displayedColumns = [
    'deliveryDate', 'amount', 'paymentDate'];
  datasource: MatTableDataSource<ClientBill>;

  _showFull = false;

  _showUnpaid = false;

  _showPending = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.setDataSource(this.full);
  }

  // inverse order : most recent first
  sortFn(b1: ClientBill, b2: ClientBill): number {
    const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
    return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
  }

  setDataSource(billsModel: ClientBill[]) {
    this.datasource =
      new MatTableDataSource<ClientBill>(billsModel);
  }

  get full(): ClientBill[] {
    return this.bills.sort(this.sortFn);
  }

  get unpaid(): ClientBill[] {
    return this.bills.sort(this.sortFn)
      .filter(b => !b.paymentDate
        && moment(b.deliveryDate).isBefore(moment().locale('fr').startOf('week').subtract(2, 'week')));
  }

  get pending(): ClientBill[] {
    return this.bills.sort(this.sortFn)
      .filter(b => !b.paymentDate
        && moment(b.deliveryDate).isSameOrAfter(moment().locale('fr').startOf('week').subtract(2, 'week')));
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
      console.log(this.pending);
      this.setDataSource(this.pending);
    }
  }

  billsIsEmpty(): boolean {
    return this.bills.length === 0;
  }

  gotoClientBill(id: number, ref: string) {
    this.router.navigate(['/professional/bills/clientbill', { id: id, ref: ref }]);
  }

}

