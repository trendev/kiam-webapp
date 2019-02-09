import { CoreModule } from './core.module';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

import {throwError as observableThrowError,  Observable } from 'rxjs';
import {catchError} from 'rxjs/operators';

import { Offering } from '@app/entities';

@Injectable({
  providedIn: CoreModule
})
export class OfferingsModelService {

  readonly api = `${environment.api}/OfferingsModel`;

  constructor(private http: HttpClient) { }

  build(): Observable<Offering[]> {
    return this.http.post<Offering[]>(`${this.api}/build`, null, { withCredentials: true }).pipe(
      catchError(e => observableThrowError(e)));
  }
}
