import { BillsUtils, VatAmount, VatAmountDescSortFn } from '@app/shared';
import { Component, OnInit, Input } from '@angular/core';
import { Bill } from '@app/entities';

@Component({
  selector: 'app-amount-detail',
  templateUrl: './amount-detail.component.html',
  styleUrls: ['./amount-detail.component.scss']
})
export class AmountDetailComponent implements OnInit {

  @Input() bill: Bill;

  private _amount: number;
  private _vatAmounts: VatAmount[];

  constructor() { }

  ngOnInit() {
    this._amount = BillsUtils.getAmount(this.bill);
    this._vatAmounts = BillsUtils.getVATAmounts(this.bill).sort(VatAmountDescSortFn);
  }

  get amount(): number {
    return this._amount;
  }

  get vatAmounts(): VatAmount[] {
    return this._vatAmounts;
  }

}
