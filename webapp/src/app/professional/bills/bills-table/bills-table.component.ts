import { Component, AfterViewInit, ViewChild, Input, OnChanges } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { BillModel, BillsUtils } from '@app/shared';

@Component({
  selector: 'app-bills-table',
  templateUrl: './bills-table.component.html',
  styleUrls: ['./bills-table.component.scss']
})
export class BillsTableComponent implements AfterViewInit, OnChanges {

  @Input() data: BillModel[];

  datasource: MatTableDataSource<BillModel> = new MatTableDataSource<BillModel>();
  displayedColumns = [
    'deliveryDate', 'reference', 'name', 'amount', 'payment-status'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnChanges() {
    this.datasource.data = this.data;
    console.log(this.data);
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  shrinkRef(ref: string) {
    return BillsUtils.shrinkRef(ref);
  }

}
