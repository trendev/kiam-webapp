import { CoreModule } from './core.module';

import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ClientBill } from '@app/entities';

@Injectable({
  providedIn: CoreModule
})
export class ClientBillService {

  readonly api = `${environment.api}/ClientBill`;

  constructor(private http: HttpClient) { }

  create(payload: ClientBill): Observable<ClientBill> {
    return this.http.post<ClientBill>(`${this.api}`, payload).pipe(
      map(bill => new ClientBill(bill)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: ClientBill): Observable<ClientBill> {
    return this.http.put<ClientBill>(`${this.api}`, payload).pipe(
      map(bill => new ClientBill(bill)),
      catchError(e => observableThrowError(e))
    );
  }
  
  //TODO : correct this function before use
  cancel(bill: ClientBill): Observable<ClientBill> {
    return this.http.put<ClientBill>(`${this.api}/cancel/${bill.reference}/${bill.deliveryDate}`, bill).pipe(
      map(bill => new ClientBill(bill)),
      catchError(e => observableThrowError(e))
    );
  }

}
