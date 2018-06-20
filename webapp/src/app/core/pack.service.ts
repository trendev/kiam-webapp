
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Offering, OfferingType, Pack } from '@app/entities';

@Injectable()
export class PackService {

  readonly api = `${environment.api}/Pack`;

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

  create(payload: Pack): Observable<Pack> {
    return this.http.post<Pack>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(pack => new Pack(pack)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: Pack): Observable<Pack> {
    return this.http.put<Pack>(`${this.api}`, payload, { withCredentials: true }).pipe(
      map(pack => new Pack(pack)),
      catchError(e => observableThrowError(e))
    );
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text', withCredentials: true }).pipe(
      catchError(e => observableThrowError(e)));
  }

  buildModelOfferings(): Observable<Offering[]> {
    return this.http.post<Offering[]>(`${this.api}/buildModelOfferings`, null, { withCredentials: true }).pipe(
      catchError(e => observableThrowError(e)));
  }
}
