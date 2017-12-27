import { CustomValidators } from '@app/shared';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Offering, PaymentMode, OfferingType } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Subject } from 'rxjs/Subject';
import * as moment from 'moment';

@Component({
  selector: 'app-create-bill',
  templateUrl: './create-bill.component.html',
  styleUrls: ['./create-bill.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class CreateBillComponent {
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

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
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
    this.resetRequest$.next();
  }

  save() {
  }

  cancelBillCreation() {
    this.cancel.emit();
  }

}
