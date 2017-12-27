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

  resetRequest$ = new Subject<boolean>();

  form: FormGroup;

  private commentsValidators = [
    Validators.required,
    CustomValidators.blankStringForbidden,
    Validators.maxLength(200)
  ];

  @ViewChild(ErrorAggregatorDirective) errorAggregator: ErrorAggregatorDirective;

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  ngOnInit() {
    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid && this.errorAggregator) {
        this.errorAggregator.viewContainerRef.clear();
      }
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
        deliveryDate: new FormControl(moment(), [
          CustomValidators.past
        ]),
        paymentDate: new FormControl(moment(), [
          CustomValidators.past
        ]),
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

  revert() {
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
