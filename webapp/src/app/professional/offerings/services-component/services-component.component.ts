import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Service, Offering } from '@app/entities';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-services-component',
  templateUrl: './services-component.component.html',
  styleUrls: ['./services-component.component.scss']
})
export class ServicesComponentComponent implements OnInit {

  @Input() offerings: Offering[];
  offeringsModel: Offering[];

  displayedColumns = [
    'id', 'name', 'price', 'duration'];
  datasource: MatTableDataSource<Offering>;

  @ViewChild(MatSort) sort: MatSort;

  constructor() { }

  ngOnInit() {
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
    );
    this.datasource =
      new MatTableDataSource<Offering>(this.offeringsModel);
    this.datasource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

}
