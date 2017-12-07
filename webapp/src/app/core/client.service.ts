import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, ClientBill, BillType } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { map, filter } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ErrorHandlerService } from './error-handler.service';
import { ProfessionalService } from './professional.service';

@Injectable()
export class ClientService {

  readonly api = `${environment.api}/Client`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService,
    private professionalService: ProfessionalService) { }

  create(payload: Client): Observable<Client> {
    return this.http.post<Client>(`${this.api}`, payload, { withCredentials: true })
      .map(client => new Client(client))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  update(payload: Client): Observable<Client> {
    return this.http.put<Client>(`${this.api}`, payload, { withCredentials: true })
      .map(client => new Client(client))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  getClientBills(id: number): Observable<ClientBill[]> {
    return this.professionalService.getBills().map(
      bills => bills.filter(b => b.cltype === BillType.CLIENT_BILL)
        .map(b => new ClientBill(b))
        .filter(b => b.client.id === id)
    );
  }

}
