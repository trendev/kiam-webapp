import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

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

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in CustomerDetailsComponent#init()`);
    }
    this.form = this.parent.form;
    console.log(this.form.get('customerDetails').get('comments'));
  }

  get comments(): FormArray {
    return this.form.get('customerDetails').get('comments') as FormArray;
  }

  removeComment(i: number) {
    this.comments.removeAt(i);
  }

  newComment() {
    this.comments.push(new FormControl());
  }

  removeAllComments() {
    while (this.comments.length) {
      this.comments.removeAt(0);
    }
  }

  isLastComment(i: number): boolean {
    return (this.comments.length - 1) === i;
  }

  isEmpty(): boolean {
    return this.comments.length === 0;
  }

}
