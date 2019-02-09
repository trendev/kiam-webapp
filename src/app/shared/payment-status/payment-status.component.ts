import { BillStatus, BillsUtils } from './../bills-utils';
import { Component, OnInit, Input } from '@angular/core';
import { Bill } from '@app/entities';

@Component({
  selector: 'app-payment-status',
  templateUrl: './payment-status.component.html',
  styleUrls: ['./payment-status.component.scss']
})
export class PaymentStatusComponent {

  @Input() bill: Bill;

  constructor() { }

  get status(): BillStatus {
    return BillsUtils.getStatus(this.bill);
  }

}
