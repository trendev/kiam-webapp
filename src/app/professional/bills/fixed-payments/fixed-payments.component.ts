import { PaymentsComponent } from './../payments/payments.component';
import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-fixed-payments',
  templateUrl: './fixed-payments.component.html',
  styleUrls: ['./fixed-payments.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class FixedPaymentsComponent extends PaymentsComponent implements OnInit {

  constructor(private _parent: FormGroupDirective) { super(_parent); }

  ngOnInit() {
    if (!this.parent.form) {
      throw new Error(`PaymentsComponent#ngOnChanges(): this.parent form should not be undefined or null`);
    }
    this.form = this.parent.form;
  }

}
