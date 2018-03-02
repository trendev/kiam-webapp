import { Component, AfterViewInit, ViewChild, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() gotobill = new EventEmitter<string>();

  constructor() { }

  // https://github.com/angular/material2/issues/10227

  ngOnChanges() {
    this.datasource.data = this.data;
    this.paginator.page.emit({
      pageIndex: 0,
      pageSize: 5,
      length: this.data.length
    });
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
    this.paginator.page.pipe(
      tap((e) => console.log(e))
    ).subscribe();
  }

  applyFilter(filterValue: string) {
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
