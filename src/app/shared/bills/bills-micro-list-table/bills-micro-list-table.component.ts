import { BillModel } from '../../bills-utils';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Bill } from '@app/entities';

@Component({
  selector: 'app-bills-micro-list-table',
  templateUrl: './bills-micro-list-table.component.html',
  styleUrls: ['./bills-micro-list-table.component.scss']
})
export class BillsMicroListTableComponent implements OnChanges, AfterViewInit {

  @Input() data: BillModel[];

  displayedColumns = [
    'deliveryDate', 'amount', 'payment-status'];
  datasource: MatTableDataSource<BillModel> = new MatTableDataSource<BillModel>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

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

  gotoBill(bill: BillModel) {
    this.gotobill.emit(bill);
  }

}
