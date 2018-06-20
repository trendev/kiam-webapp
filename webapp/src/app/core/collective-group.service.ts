
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { CollectiveGroup, CollectiveGroupBill } from '@app/entities';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable()
export class CollectiveGroupService {

  readonly api = `${environment.api}/CollectiveGroup`;

  constructor(private http: HttpClient) { }

  create(payload: CollectiveGroup): Observable<CollectiveGroup> {
    return this.http.post<CollectiveGroup>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(cg => new CollectiveGroup(cg)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: CollectiveGroup): Observable<CollectiveGroup> {
    return this.http.put<CollectiveGroup>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(cg => new CollectiveGroup(cg)),
      catchError(e => observableThrowError(e))
    );
  }

  getCollectiveGroupBills(id: number): Observable<CollectiveGroupBill[]> {
    return this.http.get<CollectiveGroupBill[]>(`${this.api}/${id}/collectiveGroupBills`, { withCredentials: true }).pipe(
      map(cgbills => cgbills.map(cgb => new CollectiveGroupBill(cgb))),
      catchError(e => observableThrowError(e))
    );
  }

  getCollectiveGroupBill(id: number, ref: string): Observable<CollectiveGroupBill> {
    return this.http.get<CollectiveGroupBill[]>(`${this.api}/${id}/collectiveGroupBills`, { withCredentials: true }).pipe(
      map(cgbills => {
        const bills = cgbills.filter(cgb => cgb.reference === ref);
        switch (bills.length) {
          case 0: throw new Error(`No collectivegroup bill in CollectiveGroup ${id} with reference ${ref}`);
          case 1: return bills[0];
          default: throw new Error(`Too many collectivegroup bills with reference ${ref}`); // should not happen
        }
      }),
      catchError(e => observableThrowError(e))
    );
  }


}
