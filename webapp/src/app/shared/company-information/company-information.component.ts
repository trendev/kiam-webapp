import { CustomValidators } from './../custom-validators';
import { ErrorAggregatorDirective } from './../error-aggregator.directive';
import { Component, OnInit, ViewChild, Input, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-company-information',
  templateUrl: './company-information.component.html',
  styleUrls: ['./company-information.component.scss'],
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
export class CompanyInformationComponent implements OnInit {

  form: FormGroup;
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;


  // float label option of the vatcode input
  floatLabel = 'auto';

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in CompanyInformationComponent#init()`);
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

    // used to fix an issue on iOS where the computed vatcode were overlayed by the floating label
    this.form.get('companyInformation')
      .get('companyCodes')
      .get('vatcode').valueChanges.forEach(value => {
        if (!value) {
          this.floatLabel = 'auto';
        } else {
          this.floatLabel = 'always';
        }
      });
  }

  expectedVatCode() {
    const vatcode =
      CustomValidators.computeVatCodeFromCompanyID(this.form.get('companyInformation').get('companyCodes').get('companyID').value);
    this.form.get('companyInformation').get('companyCodes').get('vatcode').setValue(vatcode);
    this.form.get('companyInformation').get('companyCodes').get('vatcode').markAsDirty();
    this.form.get('companyInformation').get('companyCodes').get('vatcode').markAsTouched();
  }
}
