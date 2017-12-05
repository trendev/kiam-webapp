import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-payment-modes',
  templateUrl: './payment-modes.component.html',
  styleUrls: ['./payment-modes.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PaymentModesComponent implements OnInit {

  form: FormGroup;

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in PaymentModesComponent#init()`);
    }
    this.form = this.parent.form;
  }

  get paymentModes(): FormArray {
    return this.form.get('paymentModes') as FormArray;
  }

}
