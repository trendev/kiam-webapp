import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { Service, Offering, Business } from '@app/entities';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Utils } from '@app/shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-services-component',
  templateUrl: './services-component.component.html',
  styleUrls: ['./services-component.component.scss']
})
export class ServicesComponentComponent implements OnChanges {

  @Input() offerings: Offering[];
  offeringsModel: OfferingModel[];

  displayedColumns = [
    'id', 'name', 'shortname', 'price', 'duration', 'businesses'];
  datasource: MatTableDataSource<OfferingModel>;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private router: Router,
    private route: ActivatedRoute) { }

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
        shortname: o.shortname || '',
        price: o.price || 0,
        duration: o.duration || 0,
        businesses: Utils.getBusinesses(o.businesses)
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

  gotoService(id: number) {
    this.router.navigate(['service/' + id], { relativeTo: this.route });
  }

}

interface OfferingModel {
  id: number;
  name: string;
  shortname: string;
  price: number;
  duration: number;
  businesses: string;
}
