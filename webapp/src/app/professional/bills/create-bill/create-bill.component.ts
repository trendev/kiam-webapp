import { CustomValidators, ErrorAggregatorDirective, Utils } from '@app/shared';
import { Component, Input, EventEmitter, Output, ViewChild, OnInit, OnChanges, DoCheck, ChangeDetectorRef } from '@angular/core';
import { Offering, PaymentMode, OfferingType, Bill, Payment, VatRates } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss']
})
export class CreateBillComponent implements OnInit, OnChanges, DoCheck {
  @Input() offerings: Offering[];
  @Input() paymentModes: PaymentMode[];
  @Input() billsRefDate: number;
  @Input() vatRates: VatRates;

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

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.initAmountComputation();
  }

  private initAmountComputation() {
    this._total = 0;
    this._amount = 0;
    this._discount = 0;
  }

  ngOnInit() {
    this.form = this.createForm();

    // inits the delivery and payment dates bounds
    this.setDatesValidators();

    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
    });

    // compute the amount everytime the discount value is changed
    this.form.get('information').get('discount').valueChanges
      .map(value => +value ? value : 0)
      .forEach(value => {
        // this._discount = Math.round(parseFloat((value * Math.pow(10, 2)).toFixed(2)));
        this._discount = Math.round(value * 100);
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
          CustomValidators.validPayments(Math.round(value * 100))
        ]);
        this.paymentsContent.updateValueAndValidity();
      });
  }

  ngOnChanges() {
    // changes should occur if the deliveryDate of the submitted bill is not correct
    if (this.form) { this.setDatesValidators(); }
  }

  public ngDoCheck(): void {
    this.cdr.detectChanges();
  }

  setDatesValidators() {
    this.form.get('information').get('dates').setValidators(Validators.compose([
      CustomValidators.validDeliveryPaymentDates,
      CustomValidators.validBillDates(this.billsRefDate)
    ]));
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      vatInclusive: new FormControl(this.vatRates ? true : false),
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
        }),
        closeable: new FormControl({
          value: true,
          disabled: false
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
    return this._amount <= 0 // if amount <= 0, the bill will be auto-closed
      ? true // old condition : this.form.get('information').get('dates').get('paymentDate').value
      : ((Math.round(Utils.totalPayments(this.paymentsContent.value) * 100) === this._amount)
        && this.form.get('information').get('dates').get('paymentDate').value);
  }

  isValid(): boolean {
    return !(this.form.pristine || this.form.invalid)
      && Utils.hasValidPaymentState(this.form);
  }

  /**
   * First, reset the purchased offering component, then the amounts values and at last the form model.
   * Operations order is important (ex: avoid the total amount to be computed after the form model reset...)
   */
  revert() {
    this.resetRequest$.next(true);

    this.initAmountComputation();
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const information = this.form.get('information') as FormGroup;
    information.setControl('comments', this.fb.array([], CustomValidators.validComments(this.commentsValidators)));
  }

  saveBill() {
    const bill = this.prepareSave();
    this.save.emit(bill);
  }

  /**
   * Prepare the save and auto-close the bill if amount <= 0
  */
  prepareSave(): Bill {
    const value = this.form.getRawValue();

    return new Bill({
      amount: Math.round(this._amount),
      discount: this._discount,
      deliveryDate: value.information.dates.deliveryDate.valueOf(),
      paymentDate: value.information.dates.paymentDate
        ? value.information.dates.paymentDate.valueOf()
        : (this._amount <= 0 // auto-close the bill if amount <= 0
          ? value.information.dates.deliveryDate.valueOf()
          : undefined),
      comments: value.information.comments || undefined,
      purchasedOfferings: value.purchasedOfferings.content,
      payments: value.payments.content.map(pm => new Payment({
        amount: Math.round(pm.amount * 100),
        paymentMode: pm.paymentMode
      })),
      vatInclusive: value.vatInclusive
    });
  }

  cancelBillCreation() {
    this.cancel.emit();
  }

  get vatInclusive(): AbstractControl {
    return this.form.get('vatInclusive');
  }

  vatChanges(change: MatSlideToggleChange) {
    this.vatInclusive.setValue(change.checked);
    this.vatInclusive.markAsDirty();
    this.vatInclusive.markAsTouched();
  }

}
