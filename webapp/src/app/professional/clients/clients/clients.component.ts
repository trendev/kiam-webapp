import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/finally';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Client } from '@app/entities';
import { MatTableDataSource, MatSort, Sort } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingOverlayService } from '@app/loading-overlay.service';
import { PhonePipe } from '@app/shared';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {

  clients: ClientModel[] = [];
  private _clients: Client[];

  private phonePipe = new PhonePipe();

  displayedColumns: string[];
  datasource: MatTableDataSource<ClientModel>;

  columns: ClientColumnDef[] = [
    { columnDef: 'id', headerCellDef: 'Code client', cellDef: (client: ClientModel) => client.id, hide: true },
    { columnDef: 'lastName', headerCellDef: 'Nom', cellDef: (client: ClientModel) => client.lastName, hide: false },
    { columnDef: 'firstName', headerCellDef: 'Prénom', cellDef: (client: ClientModel) => client.firstName, hide: false },
    { columnDef: 'nickname', headerCellDef: 'Surnom', cellDef: (client: ClientModel) => client.nickname, hide: true },
    { columnDef: 'phone', headerCellDef: 'Tél.', cellDef: (client: ClientModel) => this.phonePipe.transform(client.phone), hide: true },
    { columnDef: 'email', headerCellDef: 'Email', cellDef: (client: ClientModel) => client.email, hide: true },
  ];

  @ViewChild(MatSort) sort: MatSort;

  constructor(private professionalService: ProfessionalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingOverlayService: LoadingOverlayService) {
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
    this.professionalService.getClients()
      .finally(() => this.loadingOverlayService.stop())
      .subscribe(
      clients => {
        this._clients = clients;
        this.initClients();
      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des clients depuis le serveur`)
      );
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasource.filter = filterValue;
  }

  gotoClientDetails(id: number) {
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


