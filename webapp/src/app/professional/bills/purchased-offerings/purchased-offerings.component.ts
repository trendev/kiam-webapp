import { Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { Offering, Service, Pack, OfferingType, PurchasedOffering } from '@app/entities';
import { MatTableDataSource, MatSort, MatCheckboxChange } from '@angular/material';
import { Utils, ErrorAggregatorDirective } from '@app/shared';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-purchased-offerings',
  templateUrl: './purchased-offerings.component.html',
  styleUrls: ['./purchased-offerings.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class PurchasedOfferingsComponent implements OnInit, OnDestroy {

  form: FormGroup;
  @Input() offerings: Offering[];
  @Input() resetRequest$: Subject<boolean>;
  sub: Subscription;

  offeringsModel: PurchasedOfferingModel[];
  displayedColumns = [
    'checked', 'qty', 'name', 'price', 'businesses'];
  datasource: MatTableDataSource<PurchasedOfferingModel>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('errorsTemplate') errorsTemplate;
  @ViewChild('errorContainer', { read: ViewContainerRef }) errorContainer;
  @Input() errorAggregator: ErrorAggregatorDirective;

  @Output() total = new EventEmitter<number>();

  omSortFn = (om1, om2) => om1.name.localeCompare(om2.name);

  constructor(private parent: FormGroupDirective) { }

  ngOnInit() {
    if (!this.parent.form) {
      throw new Error(`PackContentComponent#ngOnInit(): this.parent form should not be undefined or null`);
    }
    this.form = this.parent.form;

    this.form.valueChanges.forEach(_ => {
      if (this.form.invalid
        && this.errorsTemplate
        && this.errorContainer
        && this.errorAggregator) {
        this.errorContainer.clear();
        this.errorContainer.createEmbeddedView(this.errorsTemplate);
        this.errorAggregator.viewContainerRef.createEmbeddedView(this.errorsTemplate);
      }
    });

    this.initOfferingsModel();
    this.sub = this.resetRequest$.subscribe(b => this.initOfferingsModel());

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get purchasedOfferingsContent(): AbstractControl {
    return this.form.get('purchasedOfferings').get('content');
  }

  initOfferingsModel() {
    this.offeringsModel = this.offerings
      .map(
      o => {
        return {
          checked: false,
          qty: 0,
          name: o.shortname || o.name,
          price: o.price,
          businesses: Utils.getBusinesses(o.businesses), // display businesses as a string
          offering: o
        };
      }
      )
      .sort(this.omSortFn);

    this.datasource =
      new MatTableDataSource<PurchasedOfferingModel>(this.offeringsModel);
    this.datasource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  select(event: MatCheckboxChange, element: PurchasedOfferingModel) {
    element.checked = event.checked;
    this.onSelection(element);
  }

  onSelection(element: PurchasedOfferingModel) {
    if (element.checked) {
      element.qty = 1;
    } else {
      element.qty = 0;
    }
    this.computePurchasedOfferingsValue();
  }

  computePurchasedOfferingsValue() {
    const value = this.offeringsModel
      .filter(om => om.checked)
      .map(om => new PurchasedOffering({
        qty: om.qty,
        offering: om.offering
      }));

    this.total.emit(value
      .map(po => po.qty * po.offering.price)
      .reduce((a, b) => a + b, 0)
      || 0); // if the computed value is null or defined, will return 0

    this.purchasedOfferingsContent.setValue(value);

    this.purchasedOfferingsContent.markAsDirty();
    this.purchasedOfferingsContent.markAsTouched();
  }
}

interface PurchasedOfferingModel {
  checked: boolean;
  qty: number;
  name: string;
  price: number;
  businesses: string;
  offering: Offering;
}
