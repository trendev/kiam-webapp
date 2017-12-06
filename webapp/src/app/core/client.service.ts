import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client } from '@app/entities';
import { Observable } from 'rxjs/Observable';
import { environment } from '@env/environment';

@Injectable()
export class ClientService {

  readonly api = `${environment.api}/Client`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

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

}
