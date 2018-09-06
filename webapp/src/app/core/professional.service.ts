import { CoreModule } from './core.module';

import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
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
  BillType,
  ClientBill,
  CollectiveGroupBill,
  IndividualBill,
  OfferingType,
  Pack,
  Service
} from '@app/entities';

@Injectable({
  providedIn: CoreModule
})
export class ProfessionalService {

  readonly api = `${environment.api}/Professional`;

  constructor(private http: HttpClient) { }

  profile(refresh: boolean = false): Observable<Professional> {
    return this.http.get<Professional>(`${this.api}/profile`,
      {
        params: new HttpParams().set('refresh', `${refresh}`),
        withCredentials: true
      }).pipe(
        map(pro => new Professional(pro)),
        catchError(e => observableThrowError(e))
      );
  }

  put(payload: Professional): Observable<Professional> {
    return this.http.put<Professional>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(_pro => new Professional(_pro)),
      catchError(e => observableThrowError(e))
    );
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.api}/clients`,
      {
        withCredentials: true
      }).pipe(
        map(result => result.map(r => new Client(r))),
        catchError(e => observableThrowError(e))
      );
  }

  getCollectiveGroups(): Observable<CollectiveGroup[]> {
    return this.http.get<CollectiveGroup[]>(`${this.api}/collectiveGroups`,
      {
        withCredentials: true
      }).pipe(
        map(result => result.map(r => new CollectiveGroup(r))),
        catchError(e => observableThrowError(e))
      );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`,
      {
        withCredentials: true
      }).pipe(
        map(result => result.map(r => new Category(r))),
        catchError(e => observableThrowError(e))
      );
  }

  getBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.api}/bills`,
      {
        withCredentials: true
      }).pipe(
        map(result => result.map(r => {
          switch (r.cltype) {
            case BillType.CLIENT_BILL:
              return new ClientBill(r);
            case BillType.COLLECTIVE_GROUP_BILL:
              return new CollectiveGroupBill(r);
            case BillType.INDIVIDUAL_BILL:
              return new IndividualBill(r);
          }
        })),
        catchError(e => observableThrowError(e))
      );
  }

  getOfferings(): Observable<Offering[]> {
    return this.http.get<Offering[]>(`${this.api}/offerings`,
      {
        withCredentials: true
      }).pipe(
        map(result => result.map(r => {
          switch (r.cltype) {
            case OfferingType.SERVICE:
              return new Service(r);
            case OfferingType.PACK:
              return new Pack(r);
          }
        })),
        catchError(e => observableThrowError(e))
      );
  }

}
