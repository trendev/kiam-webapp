import { Observable } from 'rxjs/Observable';
import { CustomValidators, ErrorAggregatorDirective } from '@app/shared';
import { Component, Input, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Offering, PaymentMode, OfferingType } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

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
  @Output() cancel = new EventEmitter<any>();

  private _total: number;
  private _totalPayments: number;
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

  constructor(private fb: FormBuilder) {
    this.initAmountComputation();
    this.form = this.createForm();
  }

  private initAmountComputation() {
    this._total = 0;
    this._totalPayments = 0;
    this._amount = 0;
    this._discount = 0;
  }

  ngOnInit() {
    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
    });

    this.form.get('information').get('discount').valueChanges
      .map(value => +value ? value : 0)
      .forEach(value => {
        this._discount = value * 100;
        this.computeAmount();
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
          deliveryDate: new FormControl(moment(), [
            CustomValidators.past
          ]),
          paymentDate: new FormControl(moment(), [
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
        content: new FormControl([])
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

  isCloseable(): boolean {
    return this._amount === this._totalPayments
      && this.form.get('information').get('dates').get('paymentDate').value;
  }

  revert() {
    this.initAmountComputation();
    this.form.reset(this.createForm().getRawValue());

    // rebuilds the controls of the comments group if they have been modified/removed
    const information = this.form.get('information') as FormGroup;
    information.setControl('comments', this.fb.array([], CustomValidators.validComments(this.commentsValidators)));

    this.resetRequest$.next();
  }

  save() {
  }

  cancelBillCreation() {
    this.cancel.emit();
  }

}
