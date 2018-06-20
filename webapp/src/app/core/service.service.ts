
import { throwError as observableThrowError, Observable } from 'rxjs';

import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Service, Pack, Offering, OfferingType } from '@app/entities';

@Injectable()
export class ServiceService {

  readonly api = `${environment.api}/Service`;

  constructor(private http: HttpClient) { }

  getParentPacks(id: number): Observable<Pack[]> {
    return this.http.get<Offering[]>(`${this.api}/${id}/parentPacks`, { withCredentials: true }).pipe(
      map(offerings => offerings
        .filter(o => o.cltype === OfferingType.PACK)
        .map(o => new Pack(o))
      ),
      catchError(e => observableThrowError(e))
    );
  }

  create(payload: Service): Observable<Service> {
    return this.http.post<Service>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(service => new Service(service)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: Service): Observable<Service> {
    return this.http.put<Service>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(service => new Service(service)),
      catchError(e => observableThrowError(e))
    );
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text', withCredentials: true }).pipe(
      catchError(e => observableThrowError(e)));
  }
}
