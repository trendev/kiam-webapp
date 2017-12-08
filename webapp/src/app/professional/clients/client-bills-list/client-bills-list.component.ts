import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ClientBill } from '@app/entities';
import { MatTableDataSource, MatSort } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-client-bills-list',
  templateUrl: './client-bills-list.component.html',
  styleUrls: ['./client-bills-list.component.scss']
})
export class ClientBillsListComponent implements OnInit {

  @Input() bills: ClientBill[];

  displayedColumns = [
    'deliveryDate', 'amount', 'reference'];
  datasource: MatTableDataSource<ClientBill>;


  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
    this.datasource =
      new MatTableDataSource<ClientBill>(this.bills.sort(
        (b1, b2) => -moment(b1.deliveryDate).diff(moment(b2.deliveryDate)) // inverse order : most recent first
      ));
    this.datasource.sort = this.sort;
  }

  get unpaid(): number {
    return this.bills.filter(b => !b.paymentDate).length;
  }

  billsIsEmpty(): boolean {
    return this.bills.length === 0;
  }

  applyFilter(filterValue: string) {
    // filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }
}

