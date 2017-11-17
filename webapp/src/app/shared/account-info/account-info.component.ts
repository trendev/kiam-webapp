import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormControl, Form } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material';

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
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] }
  ]
})
export class AccountInfoComponent implements OnInit {

  constructor(parent: FormGroupDirective) {
  }

  ngOnInit() {
  }

}
