import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-payment-mode',
  templateUrl: './payment-mode.component.html',
  styleUrls: ['./payment-mode.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PaymentModeComponent implements OnInit {

  form: FormGroup;

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in PaymentModeComponent#init()`);
    }
    this.form = this.parent.form;
  }

  get paymentModes(): FormArray {
    return this.form.get('paymentModes') as FormArray;
  }

}
