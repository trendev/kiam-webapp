import { ErrorAggregatorDirective } from '../error-aggregator.directive';
import { Component, OnInit, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, AbstractControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class CommentsComponent implements OnInit {

  form: FormGroup;
  @Input() comments: FormArray;
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
