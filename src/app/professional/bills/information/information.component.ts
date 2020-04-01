import { Component, OnChanges, ViewChild, Input, ViewContainerRef, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ErrorAggregatorDirective } from '@app/shared';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class InformationComponent implements OnChanges, OnInit {
  form: FormGroup;
  @ViewChild('errorsTemplate', { static: true }) errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef, static: true }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;
  @Input() billsRefDate: number;

  minDate: Moment;
  maxDate = moment({ hour: 0 });

  private lastPaymentDate = moment({ hour: 0 });

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (!this.parent.form) {
      throw new Error(`PackContentComponent#ngOnChanges(): this.parent form should not be undefined or null`);
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

    this.paymentDate.valueChanges.forEach(value => {
      // if the closeable field is disabled it means paymentDate has to be also disabled (paid bill)
      if (value && this.paymentDate.disabled && !this.closeable.disabled) {
        this.paymentDate.enable();
      }
    });

  }

  ngOnChanges() {
    this.minDate = this.billsRefDate ? moment(this.billsRefDate) : undefined;
  }

  get comments(): AbstractControl {
    return this.form.get('information').get('comments');
  }

  get deliveryDate(): Moment {
    const value = this.form.get('information').get('dates').get('deliveryDate').value;
    return value ? value : undefined;
  }

  get paymentDate(): AbstractControl {
    return this.form.get('information').get('dates').get('paymentDate');
  }

  get closeable(): AbstractControl {
    return this.form.get('information').get('closeable');
  }

  closeableChanges(change: MatSlideToggleChange) {
    this.closeable.setValue(change.checked);
    this.closeable.markAsDirty();
    this.closeable.markAsTouched();

    if (change.checked) {
      this.paymentDate.enable({ emitEvent: false }); // avoid to emit this changes...
      this.paymentDate.reset(this.lastPaymentDate);
    } else {
      this.lastPaymentDate = this.paymentDate.value;
      this.paymentDate.disable({ emitEvent: false }); // avoid to emit this changes...
      this.paymentDate.reset();
    }

  }

}
