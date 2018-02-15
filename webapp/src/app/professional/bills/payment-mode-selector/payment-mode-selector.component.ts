import { comparePaymentModesFn } from '@app/shared';
import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { PaymentMode } from '@app/entities';
import { MatSelectionListChange } from '@angular/material';

@Component({
  selector: 'app-payment-mode-selector',
  templateUrl: './payment-mode-selector.component.html',
  styleUrls: ['./payment-mode-selector.component.scss']
})
export class PaymentModeSelectorComponent implements OnChanges {

  @Input() paymentModes: PaymentMode[] = [];
  private _selectedPaymentMode: PaymentMode[];
  @Output() updatePaymentModeSelection = new EventEmitter<PaymentMode[]>();

  constructor() { }

  ngOnChanges() {
    this._selectedPaymentMode = this.paymentModes;
  }

  selectionChange(change: MatSelectionListChange) {
    if (change.option.selected) {
      this.addPaymentMode(change.option.value);
    } else {
      this.removePaymentMode(change.option.value);
    }
  }

  removePaymentMode(pm: PaymentMode) {
    this._selectedPaymentMode = this._selectedPaymentMode.filter(_pm => pm.name !== _pm.name);
    this.emitUpdate();
  }

  addPaymentMode(pm: PaymentMode) {
    this._selectedPaymentMode.push(pm);
    this._selectedPaymentMode = this._selectedPaymentMode.sort(comparePaymentModesFn);
    this.emitUpdate();
  }

  private emitUpdate() {
    this.updatePaymentModeSelection.emit(this._selectedPaymentMode);
  }

}
