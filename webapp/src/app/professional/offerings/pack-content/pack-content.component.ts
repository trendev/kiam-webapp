import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pack-content',
  templateUrl: './pack-content.component.html',
  styleUrls: ['./pack-content.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PackContentComponent implements OnInit {
  form: FormGroup;

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in PackContentComponent#init()`);
    }
    this.form = this.parent.form;
    console.log(this.form.get('content').get('offerings'));
  }

}
