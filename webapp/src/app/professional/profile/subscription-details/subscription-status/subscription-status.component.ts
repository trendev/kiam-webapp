import { StripeSubscription } from './../stripe-subscription.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-status',
  templateUrl: './subscription-status.component.html',
  styleUrls: ['./subscription-status.component.scss']
})
export class SubscriptionStatusComponent implements OnInit {
  @Input() subscription: StripeSubscription;
  constructor() { }

  ngOnInit() {
  }

  get isRescinded(): boolean {
    return !!this.subscription.canceled_at;
  }

}
