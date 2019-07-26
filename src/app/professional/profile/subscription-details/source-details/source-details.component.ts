import { StripePaymentMethod } from './../stripe-payment-method.model';
import { Component, OnChanges, Input, EventEmitter, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.scss']
})
export class SourceDetailsComponent {

  @Input() source: StripePaymentMethod;
  @Output() default = new EventEmitter<string>();
  @Output() detach = new EventEmitter<string>();

  constructor() { }

  defaultAction() {
    this.default.emit(this.source.id);
  }

  detachAction() {
    this.detach.emit(this.source.id);
  }

}
