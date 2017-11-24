import { Component } from '@angular/core';
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
export class AccountInfoComponent {


  constructor(private parent: FormGroupDirective) {
  }
}
