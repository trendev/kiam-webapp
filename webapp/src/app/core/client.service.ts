
import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, ClientBill } from '@app/entities';
import { environment } from '@env/environment';

@Injectable()
export class ClientService {

  readonly api = `${environment.api}/Client`;

  constructor(private http: HttpClient) { }

  create(payload: Client): Observable<Client> {
    return this.http.post<Client>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(client => new Client(client)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: Client): Observable<Client> {
    return this.http.put<Client>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(client => new Client(client)),
      catchError(e => observableThrowError(e))
    );
  }

  getClientBills(id: number): Observable<ClientBill[]> {
    return this.http.get<ClientBill[]>(`${this.api}/${id}/clientBills`, { withCredentials: true }).pipe(
      map(clientBills => clientBills.map(cb => new ClientBill(cb))),
      catchError(e => observableThrowError(e))
    );
  }

  getClientBill(id: number, ref: string): Observable<ClientBill> {
    return this.http.get<ClientBill[]>(`${this.api}/${id}/clientBills`, { withCredentials: true }).pipe(
      map(clientBills => {
        const bills = clientBills.filter(cb => cb.reference === ref);
        switch (bills.length) {
          case 0: throw new Error(`No client bill in Client ${id} with reference ${ref}`);
          case 1: return bills[0];
          default: throw new Error(`Too many client bills with reference ${ref}`); // should not happen
        }
      }),
      catchError(e => observableThrowError(e))
    );
  }

}
