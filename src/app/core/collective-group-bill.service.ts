import { CoreModule } from './core.module';

import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { CollectiveGroupBill } from '@app/entities';

@Injectable({
  providedIn: CoreModule
})
export class CollectiveGroupBillService {

  readonly api = `${environment.api}/CollectiveGroupBill`;

  constructor(private http: HttpClient) { }

  create(payload: CollectiveGroupBill): Observable<CollectiveGroupBill> {
    return this.http.post<CollectiveGroupBill>(`${this.api}`, payload).pipe(
      map(bill => new CollectiveGroupBill(bill)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: CollectiveGroupBill): Observable<CollectiveGroupBill> {
    return this.http.put<CollectiveGroupBill>(`${this.api}`, payload).pipe(
      map(bill => new CollectiveGroupBill(bill)),
      catchError(e => observableThrowError(e))
    );
  }

}
