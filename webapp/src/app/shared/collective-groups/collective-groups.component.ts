import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-collective-groups',
  templateUrl: './collective-groups.component.html',
  styleUrls: ['./collective-groups.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class CollectiveGroupsComponent implements OnInit {
  form: FormGroup;
  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in CollectiveGroupsComponent#init()`);
    }
    this.form = this.parent.form;
  }

  get collectiveGroups(): FormArray {
    return this.form.get('collectiveGroups') as FormArray;
  }

}
