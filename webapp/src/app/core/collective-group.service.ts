import { CollectiveGroup, CollectiveGroupBill } from '@app/entities';
import { ErrorHandlerService } from '@app/error-handler.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CollectiveGroupService {

  readonly api = `${environment.api}/CollectiveGroup`;

  constructor(private http: HttpClient,
    private errorHandler: ErrorHandlerService) { }

  create(payload: CollectiveGroup): Observable<CollectiveGroup> {
    return this.http.post<CollectiveGroup>(`${this.api}`, payload, { withCredentials: true })
      .map(cg => new CollectiveGroup(cg))
      .catch(e => Observable.throw(e));
  }

  update(payload: CollectiveGroup): Observable<CollectiveGroup> {
    return this.http.put<CollectiveGroup>(`${this.api}`, payload, { withCredentials: true })
      .map(cg => new CollectiveGroup(cg))
      .catch(e => Observable.throw(e));
  }

  getCollectiveGroupBills(id: number): Observable<CollectiveGroupBill[]> {
    return this.http.get<CollectiveGroupBill[]>(`${this.api}/${id}/collectiveGroupBills`, { withCredentials: true })
      .map(cgbills => cgbills.map(cgb => new CollectiveGroupBill(cgb)))
      .catch(e => Observable.throw(e));
  }

  getCollectiveGroupBill(id: number, ref: string): Observable<CollectiveGroupBill> {
    return this.http.get<CollectiveGroupBill[]>(`${this.api}/${id}/collectiveGroupBills`, { withCredentials: true })
      .map(cgbills => {
        const bills = cgbills.filter(cgb => cgb.reference === ref);
        switch (bills.length) {
          case 0: throw new Error(`No collectivegroup bill in CollectiveGroup ${id} with reference ${ref}`);
          case 1: return bills[0];
          default: throw new Error(`Too many collectivegroup bills with reference ${ref}`); // should not happen
        }
      })
      .catch(e => Observable.throw(e));
  }


}
