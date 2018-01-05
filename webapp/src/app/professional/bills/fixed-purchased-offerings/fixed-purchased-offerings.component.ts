import { PurchasedOffering } from '@app/entities';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Utils } from '@app/shared';

@Component({
  selector: 'app-fixed-purchased-offerings',
  templateUrl: './fixed-purchased-offerings.component.html',
  styleUrls: ['./fixed-purchased-offerings.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class FixedPurchasedOfferingsComponent implements OnInit {

  form: FormGroup;

  purchasedOfferingsModel: PurchasedOfferingModel[];
  displayedColumns = [
    'qty', 'name', 'price', 'businesses'];
  datasource: MatTableDataSource<PurchasedOfferingModel>;

  @ViewChild(MatSort) sort: MatSort;

  pomSortFn = (pom1, pom2) => pom1.name.localeCompare(pom2.name);

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (!this.parent.form) {
      throw new Error(`PackContentComponent#ngOnInit(): this.parent form should not be undefined or null`);
    }
    this.form = this.parent.form;
    this.initpurchasedOfferingsModel();
  }

  get purchasedOfferingsContent(): AbstractControl {
    return this.form.get('purchasedOfferings').get('content');
  }

  initpurchasedOfferingsModel() {
    const purchasedOfferings = this.purchasedOfferingsContent.value as PurchasedOffering[];
    this.purchasedOfferingsModel = purchasedOfferings
      .map(
      po => {
        // use snapshotOffering instead of offering
        return {
          qty: po.qty,
          name: po.offeringSnapshot.name,
          price: po.offeringSnapshot.price,
          businesses: Utils.getBusinesses(po.offeringSnapshot.businesses) // display businesses as a string
        };
      }
      )
      .sort(this.pomSortFn);

    this.datasource =
      new MatTableDataSource<PurchasedOfferingModel>(this.purchasedOfferingsModel);
    this.datasource.sort = this.sort;
  }

}

interface PurchasedOfferingModel {
  qty: number;
  name: string;
  price: number;
  businesses: string;
}
