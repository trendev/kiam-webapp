import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import { Pack } from '@app/entities';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-parent-packs',
  templateUrl: './parent-packs.component.html',
  styleUrls: ['./parent-packs.component.scss']
})
export class ParentPacksComponent implements OnChanges {

  @Input() parentPacks: Pack[];
  offeringsModel: OfferingModel[];
  displayedColumns = [
    'id', 'name', 'price'];
  datasource: MatTableDataSource<OfferingModel>;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router,
    private route: ActivatedRoute) { }

  ngOnChanges() {
    this.offeringsModel = this.parentPacks.sort(
      (p1, p2) => {
        const diff = p1.name.localeCompare(p2.name);
        if (!diff) {
          const biz1 = p1.businesses.map(b => b.designation).join(',') || '';
          const biz2 = p2.businesses.map(b => b.designation).join(',') || '';
          return biz1.localeCompare(biz2);
        }
        return diff;
      }
    ).map(o => {
      return {
        id: o.id || 0,
        name: o.shortname || o.name,
        price: o.price || 0
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

  gotoPack(id: number) {
    this.router.navigate(['../../pack/' + id], { relativeTo: this.route });
  }

}

interface OfferingModel {
  id: number;
  name: string;
  price: number;
}
