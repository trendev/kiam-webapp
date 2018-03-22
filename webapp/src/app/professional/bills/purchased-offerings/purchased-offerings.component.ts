import { Component, OnInit, Input, ViewChild, OnDestroy, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, AbstractControl } from '@angular/forms';
import { Offering, Service, Pack, OfferingType, PurchasedOffering, VatRates } from '@app/entities';
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
  @Input() vatRates: VatRates;
  @Input() resetRequest$: Subject<boolean>;

  private _rates: number[];

  sub: Subscription;

  offeringsModel: PurchasedOfferingModel[];

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

    this.vatInclusive.valueChanges.forEach(_ => this.computePurchasedOfferingsValue());

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
            vatRate: this.rates.length ? this.rates[0] : undefined,
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
        vatRate: this.vatInclusive.value ? om.vatRate : undefined,
        offering: om.offering
      }));

    this.total.emit(value
      .map(po => this.vatInclusive.value
        ? po.qty * Math.round((po.offering.price * (100 + po.vatRate)) / 100) // with VAT
        : po.qty * po.offering.price) // without VAT
      .reduce((a, b) => a + b, 0)
      || 0); // if the computed value is null or defined, will return 0

    this.purchasedOfferingsContent.setValue(value);

    this.purchasedOfferingsContent.markAsDirty();
    this.purchasedOfferingsContent.markAsTouched();
  }

  get vatInclusive(): AbstractControl {
    return this.form.get('vatInclusive');
  }

  get rates(): number[] {
    if (!this._rates) {
      this._rates = this.vatRates
        ? this.vatRates.rates.sort((a, b) => b - a) // DESC sort
        : [];
    }
    return this._rates;
  }

  get displayedColumns(): string[] {
    return this.vatInclusive.value
      ? ['checked', 'qty', 'name', 'price', 'vatrate', 'businesses']
      : ['checked', 'qty', 'name', 'price', 'businesses'];
  }

}

interface PurchasedOfferingModel {
  checked: boolean;
  qty: number;
  name: string;
  vatRate: number;
  price: number;
  businesses: string;
  offering: Offering;
}
