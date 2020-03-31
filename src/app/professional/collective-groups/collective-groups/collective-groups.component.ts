
import {finalize} from 'rxjs/operators';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CollectiveGroup } from '@app/entities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Utils, compareCollectiveGroupsFn, SuccessMessageComponent } from '@app/shared';
import { ProfessionalService } from '@app/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-collective-groups',
  templateUrl: './collective-groups.component.html',
  styleUrls: ['./collective-groups.component.scss'],
})
export class CollectiveGroupsComponent implements OnInit, AfterViewInit {

  collectiveGroups: CollectiveGroupModel[] = [];
  private _collectiveGroups: CollectiveGroup[] = [];

  displayedColumns = ['groupName', 'city', 'phone'];
  datasource: MatTableDataSource<CollectiveGroupModel>;

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
    this.initCollectiveGroups();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }

  initCollectiveGroups() {
    this.collectiveGroups = this._collectiveGroups.sort(compareCollectiveGroupsFn).map(cg => {
      return {
        id: cg.id + '',
        groupName: cg.groupName || '',
        city: cg.address.city || '',
        phone: Utils.formatPhoneNumber(cg.phone) || ''
      };
    });
    this.datasource = new MatTableDataSource<CollectiveGroupModel>(this.collectiveGroups);
    this.datasource.sort = this.sort;
  }

  refreshCollectiveGroups() {
    this.loadingOverlayService.start();
    this.professionalService.getCollectiveGroups().pipe(
      finalize(() => this.loadingOverlayService.stop()))
      .subscribe(
        collectiveGroups => {
          this._collectiveGroups = collectiveGroups;
          this.initCollectiveGroups();
          this.snackBar.openFromComponent(SuccessMessageComponent, {
            data: `Liste des Groupes et Collectivités mise à jour`,
            duration: 2000
          });
        },
        e => this.errorHandler.handle(e, `Une erreur est survenue lors de la collecte des groupes et collectivités depuis le serveur`)
      );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  gotoCollectiveGroupDetails(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

}

interface CollectiveGroupModel {
  id: string;
  groupName: string;
  city: string;
  phone: string;
}

