import { Component, OnChanges, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators } from '@app/shared';
import { Payment, PaymentMode } from '@app/entities';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PaymentsComponent implements OnChanges {
  form: FormGroup;
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;

  @Input() amount: number;
  @Input() paymentModes: PaymentMode[];

  constructor(private parent: FormGroupDirective) { }

  ngOnChanges() {
    if (!this.parent.form) {
      throw new Error(`PaymentsComponent#ngOnChanges(): this.parent form should not be undefined or null`);
    }
    this.form = this.parent.form;

    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid
        && this.errorsTemplate
        && this.errorContainer
        && this.errorAggregator) {
        this.errorContainer.clear();
        this.errorContainer.createEmbeddedView(this.errorsTemplate);
        this.errorAggregator.viewContainerRef.createEmbeddedView(this.errorsTemplate);
      }
    });
    this.paymentsContent.setValidators([
      CustomValidators.validPayments(this.amount, this.total)
    ]);
    this.paymentsContent.updateValueAndValidity();
  }

  get paymentsContent(): AbstractControl {
    return this.form.get('payments').get('content');
  }

  get payments(): Payment[] {
    return this.paymentsContent.value;
  }

  get total(): number {
    return this.payments.map(p => p.amount).reduce((a, b) => a + b, 0);
  }

  get remaining(): number {
    return this.amount / 100 - this.total;
  }

  get remainingState(): string {
    const r = this.remaining;
    if (!r) {
      return 'ok';
    } else {
      return r > 0 ? 'low' : 'high';
    }
  }

  newPayment() {
    const _payments = this.payments.slice();
    _payments.push(new Payment({
      amount: this.remaining,
      paymentMode: this.paymentModes[0]
    }));
    this.paymentsContent.setValue(_payments);
    this.paymentsContent.markAsDirty();
    this.paymentsContent.markAsTouched();
  }

}
