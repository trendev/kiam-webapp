import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class BusinessComponent implements OnInit {

  form: FormGroup;

  constructor(private parent: FormGroupDirective) {
  }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in BusinessComponent#init()`);
    }
    this.form = this.parent.form;
  }

  get businesses(): FormArray {
    return this.form.get('businesses') as FormArray;
  }

}
