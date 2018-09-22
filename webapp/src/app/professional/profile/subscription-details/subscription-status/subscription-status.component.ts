import { StripeSubscription } from './../stripe-subscription.model';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

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

  get canceled_at(): number {
    return this.subscription.canceled_at;
  }

  get current_period_end(): string {
    moment.locale('fr');
    return moment.duration(moment(this.subscription.current_period_end).diff(moment(this.canceled_at))).humanize(true);
  }

  get removal_date(): Date {
    return moment(this.subscription.current_period_end).add(14, 'days').startOf('day').toDate();
  }

}
