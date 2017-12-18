import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';
import { Offering } from '@app/entities';

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
  @Input() offerings: Offering[];
  offeringModel: OfferingModel[];

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in PackContentComponent#init()`);
    }
    this.form = this.parent.form;
    console.log(this.form.get('content').get('offerings'));
  }

  get content(): Offering[] {
    return this.form.get('content').get('offerings').value || [];
  }

  addOffering(offering: Offering) {
    this.form.get('content').get('offerings')
      .setValue(this.content.push(offering));
  }

  removeOffering(offering: Offering) {
    this.form.get('content').get('offerings')
      .setValue(this.content.filter(o => o.id !== offering.id));
  }
}

interface OfferingModel {
  checked: boolean;
  id: number;
  name: string;
  price: number;
  duration: number;
  businesses: string;
  offering: Offering;
}
