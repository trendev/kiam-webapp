import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';
import { CollectiveGroupBill } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';

@Injectable()
export class CollectiveGroupBillService {

  readonly api = `${environment.api}/CollectiveGroupBill`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  create(payload: CollectiveGroupBill): Observable<CollectiveGroupBill> {
    return this.http.post<CollectiveGroupBill>(`${this.api}`, payload, { withCredentials: true })
      .map(bill => new CollectiveGroupBill(bill))
      .catch(e => Observable.throw(e));
  }

  update(payload: CollectiveGroupBill): Observable<CollectiveGroupBill> {
    return this.http.put<CollectiveGroupBill>(`${this.api}`, payload, { withCredentials: true })
      .map(bill => new CollectiveGroupBill(bill))
      .catch(e => Observable.throw(e));
  }

}
