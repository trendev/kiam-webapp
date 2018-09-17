import { StripeInvoice } from './stripe-invoice.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-stripe-invoices',
  templateUrl: './stripe-invoices.component.html',
  styleUrls: ['./stripe-invoices.component.scss']
})
export class StripeInvoicesComponent implements AfterViewInit, OnInit {

  invoices: StripeInvoice[];

  datasource: MatTableDataSource<StripeInvoice> = new MatTableDataSource<StripeInvoice>();
  displayedColumns = [
    'id', 'amount_paid', 'date', 'invoice_number', 'paid'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripeInvoices: any
      }) => {
        this.invoices = data.stripeInvoices.data.map(
          i => StripeInvoice.build(i));
        // ).sort((i1, i2) => i1.date);
      }
    );
  }

  ngOnInit() {
    // move to the very first page and avoid to display an empty content
    // must be performed before setting a new data set
    if (this.paginator) { this.paginator.pageIndex = 0; }

    this.datasource.data = this.invoices;
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

}
