import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {

  stripeCustomer: any;

  constructor(private route: ActivatedRoute) {
    this.route.data.subscribe(
      (data: {
        stripeCustomer: any
      }) => {
        this.stripeCustomer = data.stripeCustomer;
      }
    );
  }

  ngOnInit() {

  }

  get cardinfo(): string {
    if (this.stripeCustomer) {
      const data = this.stripeCustomer.sources.data[0].type_data;
      return `${data.brand} ${data.last4} expire ${data.exp_month}/${data.exp_year}`;
    } else {
      return 'no card';
    }
  }

}
