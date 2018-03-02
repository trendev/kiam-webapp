import { Component, OnInit, ViewChild } from '@angular/core';
import { CollectiveGroup } from '@app/entities';
import { MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Utils, CollectiveGroupsListRefreshedComponent } from '@app/shared';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent implements OnInit {

  collectiveGroups: CollectiveGroupModel[] = [];
  private _collectiveGroups: CollectiveGroup[];

  displayedColumns: string[];
  datasource: MatTableDataSource<CollectiveGroupModel>;

  columns: CollectiveGroupColumnDef[] = [
    {
      columnDef: 'id',
      headerCellDef: 'id',
      cellDef: (cg: CollectiveGroupModel) => cg.id,
      hide: true
    },
    {
      columnDef: 'groupName',
      headerCellDef: 'Nom',
      cellDef: (cg: CollectiveGroupModel) => cg.groupName,
      hide: false
    },
    {
      columnDef: 'phone',
      headerCellDef: 'Tél.',
      cellDef: (cg: CollectiveGroupModel) => Utils.formatPhoneNumber(cg.phone),
      hide: true
    },
  ];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService) {
    this.route.data.subscribe(
      (data: {
        collectiveGroups: CollectiveGroup[]
      }) => {
        this._collectiveGroups = data.collectiveGroups;
      }
    );
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.initCollectiveGroups();
  }

  initCollectiveGroups() {
    this.collectiveGroups = this._collectiveGroups.map(cg => {
      return {
        id: cg.id + '',
        groupName: cg.groupName || '',
        phone: cg.phone || ''
      };
    }).sort((cg1, cg2) => cg1.groupName.localeCompare(cg2.groupName));
    this.datasource = new MatTableDataSource<CollectiveGroupModel>(this.collectiveGroups);
    this.datasource.sort = this.sort;
  }

  refreshCollectiveGroups() {
    this.loadingOverlayService.start();
    this.professionalService.getCollectiveGroups()
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
        collectiveGroups => {
          this._collectiveGroups = collectiveGroups;
          this.initCollectiveGroups();
          this.snackBar.openFromComponent(CollectiveGroupsListRefreshedComponent, { duration: 2000 });
        },
        // TODO : handle the error
        e => this.errorHandler.handle(e, `Une erreur est survenue lors de la collecte des groupes et collectivités depuis le serveur`)
      );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  gotoCollectiveGroupDetails(id: number) {
    this.router.navigate([id], { relativeTo: this.route });
  }

}

interface CollectiveGroupModel {
  id: string;
  groupName: string;
  phone: string;
}

interface CollectiveGroupColumnDef {
  columnDef: string;
  headerCellDef: string;
  cellDef: (cg: CollectiveGroupModel) => any;
  hide: boolean;
}
