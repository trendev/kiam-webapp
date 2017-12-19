import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';
import { Offering, Business } from '@app/entities';

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
export class PackContentComponent implements OnInit, OnChanges {
  form: FormGroup;
  @Input() offerings: Offering[];
  @Input() businesses: Business[];
  offeringsModel: OfferingModel[];

  constructor(private parent: FormGroupDirective) { }

  ngOnChanges() {
    if (this.form) { this.initOfferingsModel(); }
  }

  ngOnInit() {
    if (this.parent.form === null) {
      throw new Error(`parent: FormGroupDirective should not be null in PackContentComponent#init()`);
    }
    this.form = this.parent.form;
    this.initOfferingsModel();
  }

  initOfferingsModel() {
    console.log('initOfferingsModel');
    this.offeringsModel = this.offerings.map(
      o => {
        return {
          checked: (this.content.findIndex(_o => _o.id === o.id) === -1) ? false : true,
          id: o.id,
          name: o.name,
          price: o.price,
          duration: o.duration,
          offering: o
        };
      }
    );
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
  offering: Offering;
}
