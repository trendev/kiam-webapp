import { Component, OnInit, Input } from '@angular/core';
import { Bill } from '@app/entities';

@Component({
  selector: 'app-amount-detail',
  templateUrl: './amount-detail.component.html',
  styleUrls: ['./amount-detail.component.scss']
})
export class AmountDetailComponent implements OnInit {

  @Input() bill: Bill;

  constructor() { }

  ngOnInit() {
  }

  get amount(): number {
    return this.bill.vatInclusive
      ? this.bill.purchasedOfferings.map(po => po.qty * po.offeringSnapshot.price).reduce((a, b) => a + b, 0) - this.bill.discount
      : this.bill.amount;
  }

}
