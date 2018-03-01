import { ClientBillModel } from './../client-bill-model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Bill, Client } from '@app/entities';

@Component({
  selector: 'app-client-bills-list-table',
  templateUrl: './client-bills-list-table.component.html',
  styleUrls: ['./client-bills-list-table.component.scss']
})
export class ClientBillsListTableComponent implements OnChanges, AfterViewInit {

  @Input() data: ClientBillModel[];

  displayedColumns = [
    'deliveryDate', 'amount', 'payment-status'];
  datasource: MatTableDataSource<ClientBillModel> = new MatTableDataSource<ClientBillModel>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() gotobill = new EventEmitter<ClientBillModel>();


  constructor() { }

  ngOnChanges() {
    this.datasource.data = this.data;
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  gotoClientBill(bill: ClientBillModel) {
    this.gotobill.emit(bill);
  }

}
