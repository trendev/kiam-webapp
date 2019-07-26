import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stripe-payment-method-type',
  templateUrl: './stripe-payment-method-type.component.html',
  styleUrls: ['./stripe-payment-method-type.component.scss']
})
export class StripePaymentMethodTypeComponent implements OnInit {

  @Input() type: string;

  constructor() { }

  ngOnInit() {
  }

}
