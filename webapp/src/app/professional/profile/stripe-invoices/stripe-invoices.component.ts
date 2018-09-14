import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stripe-invoices',
  templateUrl: './stripe-invoices.component.html',
  styleUrls: ['./stripe-invoices.component.scss']
})
export class StripeInvoicesComponent implements OnInit {

  invoices: [];

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripeInvoices: any
      }) => {
        const _invoices = data.stripeInvoices;
        this.invoices = _invoices.data.map(
          i => i
        );
      }
    );
  }

  ngOnInit() {
  }

}
