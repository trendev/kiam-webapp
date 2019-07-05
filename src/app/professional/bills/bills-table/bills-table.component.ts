import { Component, AfterViewInit, ViewChild, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BillModel, BillsUtils } from '@app/shared';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss']
})
export class BillsTableComponent implements AfterViewInit, OnChanges {

  @Input() data: BillModel[] = [];

  datasource: MatTableDataSource<BillModel> = new MatTableDataSource<BillModel>();
  displayedColumns = [
    'deliveryDate', 'reference', 'name', 'amount', 'payment-status'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Output() gotobill = new EventEmitter<string>();

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

  applyFilter(filterValue: string) {
    this.paginator.pageIndex = 0;
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  shrinkRef(ref: string) {
    return BillsUtils.shrinkRef(ref);
  }

  gotoBill(ref: string) {
    this.gotobill.emit(ref);
  }

}
