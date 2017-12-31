import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';
import { ClientBill } from '@app/entities';

@Injectable()
export class ClientBillService {

  readonly api = `${environment.api}/ClientBill`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  create(payload: ClientBill): Observable<ClientBill> {
    return this.http.post<ClientBill>(`${this.api}`, payload, { withCredentials: true })
      .map(bill => new ClientBill(bill))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

}
