import { CoreModule } from './core.module';
import { throwError as observableThrowError, Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';

import { Business } from '@app/entities';


@Injectable({
  providedIn: CoreModule
})
export class BusinessService {

  readonly api = `${environment.api}/Business`;

  constructor(private http: HttpClient) { }

  get businesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.api}`).pipe(
        map(result => result.map(r => new Business(r))),
        catchError(e => observableThrowError(e))
      );
  }
}
