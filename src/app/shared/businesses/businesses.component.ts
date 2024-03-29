import { ErrorAggregatorDirective } from './../error-aggregator.directive';
import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-businesses',
  templateUrl: './businesses.component.html',
  styleUrls: ['./businesses.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class BusinessesComponent implements OnInit {

  form: FormGroup;
  @ViewChild('errorsTemplate', { static: true }) errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef, static: true }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in BusinessesComponent#init()`);
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

  get businesses(): FormArray {
    return this.form.get('businesses') as FormArray;
  }

  get isEmpty(): boolean {
    return this.businesses.length === 0;
  }

}
