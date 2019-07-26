import { StripePaymentMethod } from './../stripe-payment-method.model';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-method-details',
  templateUrl: './payment-method-details.component.html',
  styleUrls: ['./payment-method-details.component.scss']
})
export class PaymentMethodDetailsComponent implements OnInit {


  @Input() pm: StripePaymentMethod;
  @Output() default = new EventEmitter<string>();
  @Output() detach = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  defaultAction() {
    this.default.emit(this.pm.id);
  }

  detachAction() {
    this.detach.emit(this.pm.id);
  }

}
