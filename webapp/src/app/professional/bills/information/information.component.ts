import { Component, OnInit, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ErrorAggregatorDirective } from '@app/shared';

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
export class InformationComponent implements OnInit {
  form: FormGroup;
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (!this.parent.form) {
      throw new Error(`PackContentComponent#ngOnInit(): this.parent form should not be undefined or null`);
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

  get comments(): AbstractControl {
    return this.form.get('information').get('comments');
  }

}
