import { ErrorAggregatorDirective } from './../error-aggregator.directive';
import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-payment-modes',
  templateUrl: './payment-modes.component.html',
  styleUrls: ['./payment-modes.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PaymentModesComponent implements OnInit {

  form: FormGroup;
  @ViewChild('errorsTemplate', { static: true }) errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef, static: true }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;
  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in PaymentModesComponent#init()`);
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

  get paymentModes(): FormArray {
    return this.form.get('paymentModes') as FormArray;
  }

}
