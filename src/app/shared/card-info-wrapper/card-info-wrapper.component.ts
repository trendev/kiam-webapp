import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-card-info-wrapper',
  templateUrl: './card-info-wrapper.component.html',
  styleUrls: ['./card-info-wrapper.component.scss']
})
export class CardInfoWrapperComponent implements OnInit {

  @Input() amount: number;
  @Input() isFirst: boolean;
  @Output() newStripePaymentMethod = new EventEmitter<any>();
  @Output() newStripeSetupIntent = new EventEmitter<any>();

  displayCardInfo = false;

  constructor() { }

  ngOnInit() {
  }

  handle(event: any) {
    this.displayCardInfo = false;
    if (this.isFirst) {
      this.newStripePaymentMethod.emit(event); // emits a PaymentMethod -> new payment method
    } else {
      this.newStripeSetupIntent.emit(event); // emits a SetupIntent -> add payment method
    }
  }

}
