import { ErrorAggregatorDirective } from './../error-aggregator.directive';
import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, Form } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

export const REGISTRATION_DATE_FORMATS = {
  parse: {
    dateInput: 'LLL',
  },
  display: {
    dateInput: 'LLL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LLL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: REGISTRATION_DATE_FORMATS },
  ]
})
export class AccountInfoComponent implements OnInit {

  form: FormGroup;
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
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
}
