import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Client } from '@app/entities';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {

  constructor(private professionalService: ProfessionalService) { }

  clients: Client[] = [];

  displayedColumns;
  dataSource;

  columns: ClientColumnDef[] = [
    { columnDef: 'id', headerCellDef: 'Code client', cellDef: (client: Client) => client.id, hide: true },
    { columnDef: 'lastName', headerCellDef: 'Nom', cellDef: (client: Client) => client.customerDetails.lastName, hide: false },
    { columnDef: 'firstName', headerCellDef: 'Prénom', cellDef: (client: Client) => client.customerDetails.firstName, hide: false },
    { columnDef: 'nickname', headerCellDef: 'Surnom', cellDef: (client: Client) => client.customerDetails.nickname, hide: true },
    { columnDef: 'phone', headerCellDef: 'Tél.', cellDef: (client: Client) => client.customerDetails.phone, hide: true },
    { columnDef: 'email', headerCellDef: 'Email', cellDef: (client: Client) => client.email, hide: true },
  ];

ngOnInit() {

  this.displayedColumns = this.columns.map(c => c.columnDef);

  this.professionalService.clients.subscribe(
    clients => {
      this.clients = clients.sort(
        (cl1, cl2) => {
          const lastName1 = cl1.customerDetails.lastName || '';
          const lastName2 = cl2.customerDetails.lastName || '';
          return lastName1.localeCompare(lastName2);
        }
      );
      this.dataSource = new MatTableDataSource<Client>(this.clients);
    },
    // TODO : handle the error
    e => console.error(`Une erreur est survenue lors de la collecte des clients sur le serveur`)
  );
}

}

interface ClientColumnDef {
  columnDef: string;
  headerCellDef: string;
  cellDef: (client: Client) => any;
  hide: boolean;
}
