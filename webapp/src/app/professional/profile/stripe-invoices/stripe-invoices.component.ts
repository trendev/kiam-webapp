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
    'invoice_number', 'date', 'amount_paid', 'paid', 'id'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripeInvoices: any
      }) => {
        this.invoices = data.stripeInvoices.data.map(
          i => StripeInvoice.build(i)
        ).sort(
          (i1: StripeInvoice, i2: StripeInvoice) => i2.date.getTime() - i1.date.getTime()
        );
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

  download(invoice_pdf: string) {
    window.open(invoice_pdf);
  }

}
