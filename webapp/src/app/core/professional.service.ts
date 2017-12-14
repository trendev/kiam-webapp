import { ErrorHandlerService } from './error-handler.service';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  Professional,
  Client,
  CollectiveGroup,
  Category,
  Bill,
  Offering,
  Expense,
  Individual,
  BillType,
  ClientBill,
  CollectiveGroupBill,
  IndividualBill
} from '@app/entities';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfessionalService {

  readonly api = `${environment.api}/Professional`;

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  profile(refresh: boolean = true): Observable<Professional> {
    return this.http.get<Professional>(`${this.api}/profile`,
      {
        params: new HttpParams().set('refresh', `${refresh}`),
        withCredentials: true
      })
      .map(pro => new Professional(pro))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  put(payload: Professional): Observable<Professional> {
    return this.http.put<Professional>(`${this.api}`, payload, { withCredentials: true })
      .map(_pro => new Professional(_pro))
      .catch(e => {
        return this.errorHandler.handle(e);
      });
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.api}/clients`,
      {
        withCredentials: true
      })
      .map(result => result.map(r => new Client(r)))
      .catch(e => this.errorHandler.handle(e));
  }

  getCollectiveGroups(): Observable<CollectiveGroup[]> {
    return this.http.get<CollectiveGroup[]>(`${this.api}/collectiveGroups`,
      {
        withCredentials: true
      })
      .map(result => result.map(r => new CollectiveGroup(r)))
      .catch(e => this.errorHandler.handle(e));
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`,
      {
        withCredentials: true
      })
      .map(result => result.map(r => new Category(r)))
      .catch(e => this.errorHandler.handle(e));
  }

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.api}/bills`,
      {
        withCredentials: true
      })
      .map(result => result.map(r => {
        switch (r.cltype) {
          case BillType.CLIENT_BILL:
            return new ClientBill(r);
          case BillType.COLLECTIVE_GROUP_BILL:
            return new CollectiveGroupBill(r);
          case BillType.INDIVIDUAL_BILL:
            return new IndividualBill(r);
        }
      }))
      .catch(e => this.errorHandler.handle(e));
  }

}
