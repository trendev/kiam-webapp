
import {finalize} from 'rxjs/operators';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Client } from '@app/entities';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { Utils, SuccessMessageComponent } from '@app/shared';
import { ErrorHandlerService } from '@app/error-handler.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit, AfterViewInit {

  clients: ClientModel[] = [];
  private _clients: Client[];

  displayedColumns: string[];
  datasource: MatTableDataSource<ClientModel>;

  columns: ClientColumnDef[] = [
    { columnDef: 'lastName', headerCellDef: 'Nom', cellDef: (client: ClientModel) => client.lastName, hide: false },
    { columnDef: 'firstName', headerCellDef: 'Prénom', cellDef: (client: ClientModel) => client.firstName, hide: false },
    { columnDef: 'nickname', headerCellDef: 'Surnom', cellDef: (client: ClientModel) => client.nickname, hide: true },
    { columnDef: 'phone', headerCellDef: 'Tél.', cellDef: (client: ClientModel) => Utils.formatPhoneNumber(client.phone), hide: true },
    { columnDef: 'email', headerCellDef: 'Email', cellDef: (client: ClientModel) => client.email, hide: true },
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
        clients: Client[]
      }) => {
        this._clients = data.clients;
      }
    );
  }

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.initClients();
  }

  ngAfterViewInit() {
    this.datasource.sort = this.sort;
  }

  initClients() {
    this.clients = this._clients.map(client => {
      return {
        id: client.id + '',
        lastName: client.customerDetails.lastName || '',
        firstName: client.customerDetails.firstName || '',
        nickname: client.customerDetails.nickname || '',
        phone: client.customerDetails.phone || '',
        email: client.email || ''
      };
    }).sort((c1, c2) => c1.lastName === c2.lastName ?
      c1.firstName.localeCompare(c2.firstName)
      : c1.lastName.localeCompare(c2.lastName));
    this.datasource = new MatTableDataSource<ClientModel>(this.clients);
    this.datasource.sort = this.sort;
  }

  refreshClients() {
    this.loadingOverlayService.start();
    this.professionalService.getClients().pipe(
      finalize(() => this.loadingOverlayService.stop()))
      .subscribe(
        clients => {
          this._clients = clients;
          this.initClients();
          this.snackBar.openFromComponent(SuccessMessageComponent, {
            data: `Référentiel client rafraîchi`, duration: 2000
          });
        },
        e => this.errorHandler.handle(e, `Une erreur est survenue lors de la collecte des clients depuis le serveur`)
      );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  gotoClientDetails(id: string) {
    this.router.navigate([id], { relativeTo: this.route });
  }

}

interface ClientModel {
  id: string;
  lastName: string;
  firstName: string;
  nickname: string;
  phone: string;
  email: string;
}

interface ClientColumnDef {
  columnDef: string;
  headerCellDef: string;
  cellDef: (client: ClientModel) => any;
  hide: boolean;
}


