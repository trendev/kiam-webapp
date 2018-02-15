import { Component, OnInit, Input } from '@angular/core';
import { PaymentMode } from '@app/entities';

@Component({
  selector: 'app-payment-mode-selector',
  templateUrl: './payment-mode-selector.component.html',
  styleUrls: ['./payment-mode-selector.component.scss']
})
export class PaymentModeSelectorComponent implements OnInit {

  @Input() paymentModes: PaymentMode[] = [];

  constructor() { }

  ngOnInit() {
  }

  paymentModeSelected(change: any) {
    console.log(change);
  }

}
