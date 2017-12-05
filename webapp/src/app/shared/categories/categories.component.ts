import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class CategoriesComponent implements OnInit {

  form: FormGroup;
  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in CategoriesComponent#init()`);
    }
    this.form = this.parent.form;
  }

  get categories(): FormArray {
    return this.form.get('categories') as FormArray;
  }

}
