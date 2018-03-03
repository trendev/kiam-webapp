import { BillModel } from '@app/shared';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Bill, Client } from '@app/entities';

@Component({
  selector: 'app-client-bills-list-table',
  templateUrl: './client-bills-list-table.component.html',
  styleUrls: ['./client-bills-list-table.component.scss']
})
export class ClientBillsListTableComponent implements OnChanges, AfterViewInit {

  @Input() data: BillModel[];

  displayedColumns = [
    'deliveryDate', 'amount', 'payment-status'];
  datasource: MatTableDataSource<BillModel> = new MatTableDataSource<BillModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() gotobill = new EventEmitter<BillModel>();


  constructor() { }

  ngOnChanges() {
    // move to the very first page and avoid to display an empty content
    // must be performed before setting a new data set
    if (this.paginator) { this.paginator.pageIndex = 0; }

    this.datasource.data = this.data;
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  gotoClientBill(bill: BillModel) {
    this.gotobill.emit(bill);
  }

}
