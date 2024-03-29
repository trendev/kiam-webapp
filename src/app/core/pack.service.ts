import { CoreModule } from './core.module';

import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Offering, OfferingType, Pack } from '@app/entities';

@Injectable({
  providedIn: CoreModule
})
export class PackService {

  readonly api = `${environment.api}/Pack`;

  constructor(private http: HttpClient) { }

  getParentPacks(id: string): Observable<Pack[]> {
    return this.http.get<Offering[]>(`${this.api}/${id}/parentPacks`).pipe(
      map(offerings => offerings
        .filter(o => o.cltype === OfferingType.PACK)
        .map(o => new Pack(o))
      ),
      catchError(e => observableThrowError(e))
    );
  }

  create(payload: Pack): Observable<Pack> {
    return this.http.post<Pack>(`${this.api}`, payload).pipe(
      map(pack => new Pack(pack)),
      catchError(e => observableThrowError(e))
    );
  }

  update(payload: Pack): Observable<Pack> {
    return this.http.put<Pack>(`${this.api}`, payload).pipe(
      map(pack => new Pack(pack)),
      catchError(e => observableThrowError(e))
    );
  }

  remove(id: string): Observable<string> {
    return this.http.delete(`${this.api}/${id}`, { responseType: 'text' }).pipe(
      catchError(e => observableThrowError(e)));
  }

}
