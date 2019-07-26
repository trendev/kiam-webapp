import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  @Input() amount: number;
  @Output() newStripePaymentMethod = new EventEmitter<any>();
  @Output() newStripeSetupIntent = new EventEmitter<any>();

  displayCardInfo = false;

  constructor() { }

  ngOnInit() {
  }

  handleNewStripePaymentMethod(pm: any) {
    this.displayCardInfo = false;
    this.newStripePaymentMethod.emit(pm);
  }

  handleNewStripeSetupIntent(si: any) {
    this.displayCardInfo = false;
    this.newStripeSetupIntent.emit(si);
  }

}
