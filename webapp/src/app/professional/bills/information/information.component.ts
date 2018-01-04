import { Component, OnChanges, ViewChild, Input, ViewContainerRef, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ErrorAggregatorDirective } from '@app/shared';
import * as moment from 'moment';
import { Moment } from 'moment';

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
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;
  @Input() billsRefDate: number;

  minDate: Moment;
  maxDate = moment({ hour: 0 });
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
  }

  ngOnChanges() {
    this.minDate = this.billsRefDate ? moment(this.billsRefDate) : undefined;
  }

  get comments(): AbstractControl {
    return this.form.get('information').get('comments');
  }

  get deliveryDate(): Moment {
    const value = this.form.get('information').get('dates').get('deliveryDate').value;
    return value ? moment(value) : undefined;
  }

}
