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

  private _clients: Observable<Client[]>;

  ngOnInit() {
  }

  get clients(): Observable<Client[]> {
    this._clients = this._clients || this.professionalService.clients;
    return this._clients;
  }

}
