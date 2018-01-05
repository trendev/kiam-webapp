import { Subscription } from 'rxjs/Subscription';
import { Component, ViewChild, ViewContainerRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ErrorAggregatorDirective, CustomValidators, Utils } from '@app/shared';
import { Payment, PaymentMode } from '@app/entities';
import { MatSelectChange } from '@angular/material';

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
export class PaymentsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @ViewChild('errorsTemplate') errorsTemplate;
  @Input() errorAggregator: ErrorAggregatorDirective;

  @Input() amount: number;
  @Input() paymentModes: PaymentMode[];

  sub: Subscription;

  constructor(protected parent: FormGroupDirective) { }

  ngOnInit() {
    if (!this.parent.form) {
      throw new Error(`PaymentsComponent#ngOnChanges(): this.parent form should not be undefined or null`);
    }
    this.form = this.parent.form;
    this.sub = this.form.valueChanges.subscribe(_ => {
      if (this.form.invalid
        && this.errorsTemplate
        && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.createEmbeddedView(this.errorsTemplate);
      }
    });
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed) {
      this.sub.unsubscribe();
    }
  }

  get paymentsContent(): AbstractControl {
    return this.form.get('payments').get('content');
  }

  get payments(): Payment[] {
    return this.paymentsContent.value;
  }

  get total(): number {
    return Utils.totalPayments(this.payments);
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

  removePayment(i: number) {
    this.payments.splice(i, 1);
    this.paymentsContent.setValue(this.payments);
    this.paymentsContent.markAsDirty();
    this.paymentsContent.markAsTouched();
  }

  checkPayments() {
    const _payments = this.payments.slice();
    this.paymentsContent.setValue(_payments.map(
      pm => new PaymentMode({
        amount: pm.amount <= 0 ? 0 : pm.amount, // auto reset the value to 0 if negative
        paymentMode: pm.paymentMode
      })
    ));
    this.paymentsContent.markAsDirty();
    this.paymentsContent.markAsTouched();
  }

  comparePaymentModes(pm1: PaymentMode, pm2: PaymentMode) {
    return pm1 && pm2 && pm1.name === pm2.name;
  }

}
