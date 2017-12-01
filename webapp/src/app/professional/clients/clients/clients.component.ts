import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { ProfessionalService } from '@app/core';
import { Client } from '@app/entities';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss'],
})
export class ClientsComponent implements OnInit {

  constructor(private professionalService: ProfessionalService) { }

  clients: Client[] = [];

  ngOnInit() {
    this.professionalService.clients.subscribe(
      clients => this.clients = clients.sort(
        (cl1, cl2) => {
          const lastName1 = cl1.customerDetails.lastName || '';
          const lastName2 = cl2.customerDetails.lastName || '';
          return lastName1.localeCompare(lastName2);
        }
      ),
      // TODO : handle the error
      e => console.error(`Une erreur est survenue lors de la collecte des clients sur le serveur`)
    );
  }

}
