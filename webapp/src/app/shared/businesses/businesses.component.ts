import { Component, OnInit } from '@angular/core';
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

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in BusinessesComponent#init()`);
    }
    this.form = this.parent.form;
  }

  get businesses(): FormArray {
    return this.form.get('businesses') as FormArray;
  }

}
