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
  billsModel: ClientBill[];

  displayedColumns = [
    'deliveryDate', 'amount', 'paymentDate'];
  datasource: MatTableDataSource<ClientBill>;

  _showFull = false;

  _showUnpaid = false;

  constructor(private router: Router) { }

  ngOnInit() {
    this.billsModel = this.bills.sort(// inverse order : most recent first
      (b1, b2) => {
        const diff = -moment(b1.deliveryDate).diff(moment(b2.deliveryDate));
        return (!diff) ? -moment(b1.issueDate).diff(moment(b2.issueDate)) : diff;
      }
    );
    this.datasource =
      new MatTableDataSource<ClientBill>(this.billsModel);
  }

  get unpaid(): number {
    return this.bills.filter(b => !b.paymentDate).length;
  }

  get showFull(): boolean {
    return this._showFull && !this.billsIsEmpty();
  }

  get showUnpaid(): boolean {
    return this._showUnpaid && !this.billsIsEmpty();
  }

  set showFull(value: boolean) {
    this._showFull = value;
    if (this._showFull) {
      this._showUnpaid = !this._showFull;
      this.datasource.data = this.billsModel;
    }
  }

  set showUnpaid(value: boolean) {
    this._showUnpaid = value;
    if (this._showUnpaid) {
      this._showFull = !this._showUnpaid;
      this.datasource.data = this.billsModel.filter(b => !b.paymentDate);
    }
  }

  billsIsEmpty(): boolean {
    return this.bills.length === 0;
  }

  gotoClientBill(id: number, ref: string) {
    this.router.navigate(['/professional/bills/clientbill', { id: id, ref: ref }]);
  }

}

