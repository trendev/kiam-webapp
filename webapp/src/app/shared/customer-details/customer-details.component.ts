import { Component, OnInit, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { ErrorAggregatorDirective } from './../error-aggregator.directive';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
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
export class CustomerDetailsComponent implements OnInit {

  form: FormGroup;
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in CustomerDetailsComponent#init()`);
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

  get comments(): FormArray {
    return this.form.get('customerDetails').get('comments') as FormArray;
  }

  removeComment(i: number) {
    this.comments.removeAt(i);
    this.form.markAsDirty();
    this.form.markAsTouched();
  }

  newComment() {
    this.comments.push(new FormControl());
    this.form.markAsDirty();
    this.form.markAsTouched();
  }

  removeAllComments() {
    while (this.comments.length) {
      this.comments.removeAt(0);
    }
    this.form.markAsDirty();
    this.form.markAsTouched();
  }

  isLastComment(i: number): boolean {
    return (this.comments.length - 1) === i;
  }

  isEmpty(): boolean {
    return this.comments.length === 0;
  }

}
