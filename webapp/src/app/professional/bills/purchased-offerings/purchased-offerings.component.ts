import { Component, OnChanges, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup } from '@angular/forms';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Offering, Service, Pack, OfferingType } from '@app/entities';

@Component({
  selector: 'app-purchased-offerings',
  templateUrl: './purchased-offerings.component.html',
  styleUrls: ['./purchased-offerings.component.scss'],
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
export class PurchasedOfferingsComponent implements OnChanges {
  form: FormGroup;

  @Input() offerings: Offering[];
  services: Service[] = [];
  packs: Pack[] = [];

  // link between the local variable and the offerings type
  // OfferingType cannot be accessed from the html template
  readonly offeringType = {
    'SERVICE': OfferingType.SERVICE,
    'PACK': OfferingType.PACK
  };

  constructor(private parent: FormGroupDirective) { }

  ngOnChanges() {
    if (!this.parent.form) {
      throw new Error(`PackContentComponent#ngOnChanges(): this.parent form should not be undefined or null`);
    }
    this.form = this.parent.form;
    this.initOfferings();
  }

  initOfferings() {

    // reset the service/pack sets
    this.services = [];
    this.packs = [];

    // build the service/pack set
    this.offerings.forEach(
      o => {
        switch (o.cltype) {
          case OfferingType.SERVICE:
            this.services.push(o as Service);
            break;
          case OfferingType.PACK:
            this.packs.push(o as Pack);
            break;
          default:
            throw new TypeError(`initOfferings(): ${o.cltype} is not a supported offering type`);
        }
      });
  }

}
