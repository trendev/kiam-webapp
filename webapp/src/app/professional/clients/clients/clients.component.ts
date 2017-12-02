import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Client } from '@app/entities';
import { MatTableDataSource, MatSort, Sort } from '@angular/material';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit, AfterViewInit {

  constructor(private professionalService: ProfessionalService) { }

  clients: ClientModel[] = [];

  displayedColumns: string[];
  datasource: MatTableDataSource<ClientModel>;

  columns: ClientColumnDef[] = [
    { columnDef: 'id', headerCellDef: 'Code client', cellDef: (client: ClientModel) => client.id, hide: true },
    { columnDef: 'lastName', headerCellDef: 'Nom', cellDef: (client: ClientModel) => client.lastName, hide: false },
    { columnDef: 'firstName', headerCellDef: 'Prénom', cellDef: (client: ClientModel) => client.firstName, hide: false },
    { columnDef: 'nickname', headerCellDef: 'Surnom', cellDef: (client: ClientModel) => client.nickname, hide: true },
    { columnDef: 'phone', headerCellDef: 'Tél.', cellDef: (client: ClientModel) => client.phone, hide: true },
    { columnDef: 'email', headerCellDef: 'Email', cellDef: (client: ClientModel) => client.email, hide: true },
  ];

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.displayedColumns = this.columns.map(c => c.columnDef);
  }

  ngAfterViewInit() {
    this.professionalService.clients.subscribe(
      clients => {
        this.clients = clients.map(client => {
          return {
            id: client.id + '',
            lastName: client.customerDetails.lastName || '',
            firstName: client.customerDetails.firstName || '',
            nickname: client.customerDetails.nickname || '',
            phone: client.customerDetails.phone || '',
            email: client.email || ''
          };
        });
        this.datasource = new MatTableDataSource<ClientModel>(this.clients);
        this.datasource.sort = this.sort;
      },
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des clients sur le serveur`)
    );
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


