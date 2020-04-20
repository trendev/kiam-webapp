import { StripeInvoice } from './stripe-invoice.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { StripeSubscriptionService } from '@app/core';
import { ErrorHandlerService } from '@app/error-handler.service';
import { catchError, finalize } from 'rxjs/operators';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { SuccessMessageComponent } from '@app/shared';

@Component({
  selector: 'app-stripe-invoices',
  templateUrl: './stripe-invoices.component.html',
  styleUrls: ['./stripe-invoices.component.scss']
})
export class StripeInvoicesComponent implements AfterViewInit, OnInit {

  invoices: StripeInvoice[];

  datasource: MatTableDataSource<StripeInvoice> = new MatTableDataSource<StripeInvoice>();
  displayedColumns = [
    'date', 'invoice_number', 'amount_due', 'paid', 'id'];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private route: ActivatedRoute,
    private stripeSubscriptionService: StripeSubscriptionService,
    private errorHandler: ErrorHandlerService,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar) {
    this.route.data.subscribe(
      (data: {
        stripeInvoices: any
      }) => {
        this.formatInvoices(data.stripeInvoices.data);
      }
    );
  }

  ngOnInit() {
    this.setDatasource();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
    this.datasource.paginator = this.paginator;
  }

  formatInvoices(invoices: any) {
    this.invoices = invoices.map(i => StripeInvoice.build(i))
      .sort((i1: StripeInvoice, i2: StripeInvoice) => i2.date.getTime() - i1.date.getTime()
      );
  }

  setDatasource() {
    // move to the very first page and avoid to display an empty content
    // must be performed before setting a new data set
    if (this.paginator) { this.paginator.pageIndex = 0; }

    this.datasource.data = this.invoices;
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

  refreshInvoices() {
    this.loadingOverlayService.start();
    this.stripeSubscriptionService.invoices()
      .pipe(
        finalize(() => this.loadingOverlayService.stop()),
        catchError(e => this.errorHandler.handle(e, `Impossible de récupérer les factures depuis votre profil...`))
      )
      .subscribe(invoices => {
        this.formatInvoices(invoices.data);
        this.setDatasource();
        this.snackBar.openFromComponent(SuccessMessageComponent, {
          data: `Liste des factures rafraîchie 🍃`,
          duration: 2000
        });
      });
  }

}
