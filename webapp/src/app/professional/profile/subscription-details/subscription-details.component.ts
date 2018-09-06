import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { StripeSubscriptionService } from '@app/core';

@Component({
  selector: 'app-subscription-details',
  templateUrl: './subscription-details.component.html',
  styleUrls: ['./subscription-details.component.scss']
})
export class SubscriptionDetailsComponent implements OnInit {

customer: Observable<any>;

  constructor(private stripeSubscriptionService: StripeSubscriptionService) { }

  ngOnInit() {
    this.customer = this.stripeSubscriptionService.details();
  }

}
