import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Pack, Business, Offering, Service, OfferingType } from '@app/entities';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Utils } from '@app/shared';

@Component({
  selector: 'app-packs-component',
  templateUrl: './packs-component.component.html',
  styleUrls: ['./packs-component.component.scss']
})
export class PacksComponentComponent implements OnChanges {

  @Input() offerings: Pack[];
  offeringsModel: OfferingModel[];

  displayedColumns = [
    'id', 'name', 'price', 'duration', 'businesses', 'content'];
  datasource: MatTableDataSource<OfferingModel>;

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnChanges() {
    this.offeringsModel = this.offerings.sort(
      (o1, o2) => {
        const diff = o1.name.localeCompare(o2.name);
        if (!diff) {
          const biz1 = o1.businesses.map(b => b.designation).join(',') || '';
          const biz2 = o2.businesses.map(b => b.designation).join(',') || '';
          return biz1.localeCompare(biz2);
        }
        return diff;
      }
    ).map(o => {
      return {
        id: o.id || 0,
        name: o.name || '',
        price: o.price || 0,
        duration: o.duration || 0,
        businesses: Utils.getBusinesses(o.businesses),
        content: this.getContent(o.offerings)
      };
    });
    this.datasource =
      new MatTableDataSource<OfferingModel>(this.offeringsModel);
    this.datasource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  private getContent(offerings: Offering[]): PackContent {
    if (!offerings || !offerings.length) {
      return {
        services: 0,
        packs: 0
      };
    }

    const services = [];
    const packs = [];

    offerings.forEach(o => {
      switch (o.cltype) {
        case OfferingType.SERVICE:
          services.push(o.id);
          break;
        case OfferingType.PACK:
          packs.push(o.id);
          break;
        default:
          throw new TypeError(`getContent(): ${o.cltype} is not a supported offering type`);
      }
    });

    return {
      services: services.length,
      packs: packs.length
    };
  }

}

interface OfferingModel {
  id: number;
  name: string;
  price: number;
  duration: number;
  businesses: string;
  content: PackContent;
}

interface PackContent {
  services: number;
  packs: number;
}

