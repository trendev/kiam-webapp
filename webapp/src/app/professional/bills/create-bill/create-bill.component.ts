import { CustomValidators, ErrorAggregatorDirective, Utils } from '@app/shared';
import { Component, Input, EventEmitter, Output, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Offering, PaymentMode, OfferingType, Bill, Payment } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent implements OnInit {
  @Input() offerings: Offering[];
  @Input() paymentModes: PaymentMode[];
  @Input() billsRefDate: number;
  @Output() cancel = new EventEmitter<any>();
  @Output() save = new EventEmitter<Bill>();

  private _total: number;
  private _amount: number;
  private _discount: number;

  resetRequest$ = new Subject<boolean>();

  form: FormGroup;

  private commentsValidators = [
    Validators.required,
    CustomValidators.blankStringForbidden,
    Validators.maxLength(200)
  ];

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    this.initAmountComputation();
    this.form = this.createForm();
  }

  private initAmountComputation() {
    this._total = 0;
    this._amount = 0;
    this._discount = 0;
  }

  ngOnInit() {
    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) { // clear the errorAggregator every time
        this.errorAggregator.viewContainerRef.clear();
      }
    });

    this.form.get('information').get('discount').valueChanges
      .map(value => +value ? value : 0)
      .forEach(value => {
        this._discount = value * 100;
        this.computeAmount();
      });

    // removes the payments if amount is 0 or less
    this.form.get('information').get('amount').valueChanges
      .map(value => +value ? value : 0)
      .forEach(value => {
        if (value <= 0) {
          this.paymentsContent.reset([]);
        }
        this.paymentsContent.setValidators([
          CustomValidators.validPayments(value * 100)
        ]);
        this.paymentsContent.updateValueAndValidity();
      });
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      information: this.fb.group({
        amount: new FormControl({ value: 0, disabled: true }, [
          Validators.min(0)
        ]),
        discount: new FormControl(0, [
          Validators.min(0)
        ]),
        dates: this.fb.group({
          deliveryDate: new FormControl(moment({ hour: 0 }), [
            Validators.required,
            CustomValidators.past
          ]),
          paymentDate: new FormControl(moment({ hour: 0 }), [
            CustomValidators.past
          ])
        }, {
            validator: CustomValidators.validBillDates
          }),
        comments: this.fb.array([],
          CustomValidators.validComments(this.commentsValidators))
      }),
      purchasedOfferings: this.fb.group({
        content: new FormControl([], [
          Validators.required,
          CustomValidators.validPurchasedOfferings
        ])
      }),
      payments: this.fb.group({
        content: new FormControl([]) // dynamic validation is performed in the compoment itself
      }),
    });
    return fg;
  }

  computeAmount() {
    this._amount = this._total - this._discount;
    this.form.get('information').get('amount').setValue(this._amount / 100); // EUR cents
  }

  set total(total: number) {
    this._total = total;
    this.computeAmount();
  }

  get amount(): number {
    return this._amount;
  }

  get paymentsContent(): AbstractControl {
    return this.form.get('payments').get('content');
  }

  isCloseable(): boolean {
    return this._amount <= 0
      ? this.form.get('information').get('dates').get('paymentDate').value
      : ((Utils.totalPayments(this.paymentsContent.value) * 100 === this._amount)
        && this.form.get('information').get('dates').get('paymentDate').value);
  }

  isValid(): boolean {
    return !(this.form.pristine || this.form.invalid)
      && Utils.hasValidPaymentState(this.form);
  }

  revert() {
    this.initAmountComputation();
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const information = this.form.get('information') as FormGroup;
    information.setControl('comments', this.fb.array([], CustomValidators.validComments(this.commentsValidators)));

    this.resetRequest$.next();
  }

  saveBill() {
    const bill = this.prepareSave();
    this.save.emit(bill);
  }

  prepareSave(): Bill {
    const value = this.form.getRawValue();

    return new Bill({
      amount: this._amount,
      discount: this._discount,
      deliveryDate: value.information.dates.deliveryDate.valueOf(),
      paymentDate: value.information.dates.paymentDate ? value.information.dates.paymentDate.valueOf() : undefined,
      comments: value.information.comments || undefined,
      purchasedOfferings: value.purchasedOfferings.content,
      payments: value.payments.content.map(pm => new Payment({
        amount: pm.amount * 100,
        paymentMode: pm.payementMode
      }))
    });
  }

  cancelBillCreation() {
    this.cancel.emit();
  }

}
