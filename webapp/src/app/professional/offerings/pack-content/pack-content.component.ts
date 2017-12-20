import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { Offering, Business } from '@app/entities';
import { Utils } from '@app/shared';
import { MatTableDataSource, MatSort, MatCheckboxChange } from '@angular/material';

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
export class PackContentComponent implements OnChanges {
  form: FormGroup;
  @Input() professionalOfferings: Offering[];
  @Input() businesses: Business[];
  @Input() id: number;
  offeringsModel: OfferingModel[];

  displayedColumns = [
    'checked', 'id', 'name', 'price', 'duration', 'businesses'];
  datasource: MatTableDataSource<OfferingModel>;

  @ViewChild(MatSort) sort: MatSort;

  omSortFn: (om1: OfferingModel, om2: OfferingModel) => number
    = (om1, om2) => {
      if (om1.checked === om2.checked) {
        return om1.name.localeCompare(om2.name);
      } else {
        return om1.checked < om2.checked ? 1 : -1;
      }
    }

  constructor(private parent: FormGroupDirective) { }

  ngOnChanges() {

    if (!this.parent.form) {
      throw new Error(`PackContentComponent#ngOnChanges(): this.parent form should not be undefined or null`);
    }

    if (!this.id) {
      throw new Error(`PackContentComponent#ngOnChanges(): [id] property is missing...`);
    }
    this.form = this.parent.form;
    this.initOfferingsModel();
  }

  initOfferingsModel() {
    this.offeringsModel = this.professionalOfferings
      .filter(o => o.id !== this.id) // remove itself from the overall offerings
      .map(
      o => {
        return {
          // check if the offering is in the pack
          checked: (this.contentOfferingsValue.findIndex(_o => _o.id === o.id) === -1) ? false : true,
          id: o.id,
          name: o.name,
          price: o.price,
          duration: o.duration,
          businesses: Utils.getBusinesses(o.businesses), // display businesses as a string
          offering: o
        };
      }
      )
      // filter checked
      // + businesses in the active businesses selection of the pack
      .filter(om => om.checked
        || om.offering.businesses.findIndex(b =>
          this.businesses.findIndex(_b => _b.designation === b.designation) !== -1) !== -1)
      .sort(this.omSortFn);

    this.datasource =
      new MatTableDataSource<OfferingModel>(this.offeringsModel);
    this.datasource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  get contentOfferings(): AbstractControl {
    return this.form.get('content').get('offerings');
  }

  get contentOfferingsValue(): Offering[] {
    return this.contentOfferings.value || [];
  }

  set contentOfferingsValue(content: Offering[]) {
    this.contentOfferings.setValue(content);
    this.contentOfferings.markAsDirty();
    this.contentOfferings.markAsTouched();
  }

  addOffering(offering: Offering) {
    const content = this.contentOfferingsValue;
    content.push(offering);
    this.contentOfferingsValue = content;
  }

  removeOffering(offering: Offering) {
    const content = this.contentOfferingsValue.filter(o => o.id !== offering.id);
    this.contentOfferingsValue = content;
  }

  select(event: MatCheckboxChange, element: OfferingModel) {
    element.checked = event.checked;
    this.onSelection(element);
  }

  onSelection(element: OfferingModel) {
    if (element.checked) {
      this.addOffering(element.offering);
    } else {
      this.removeOffering(element.offering);
    }
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
