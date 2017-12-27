import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Offering, PaymentMode, OfferingType } from '@app/entities';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Subject } from 'rxjs/Subject';

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

  constructor(private fb: FormBuilder) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    const fg = this.fb.group({
      information: this.fb.group({}),
      purchasedOfferings: this.fb.group({
        content: new FormControl([], [
          Validators.required
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
