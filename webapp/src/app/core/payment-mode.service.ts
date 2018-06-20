
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError, map,  switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { PaymentMode } from '@app/entities';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentModeService {

  readonly api = `${environment.api}/PaymentMode`;

  constructor(private http: HttpClient) { }

  get paymentModes(): Observable<PaymentMode[]> {

    return this.http.get<PaymentMode[]>(`${this.api}`,
      {
        withCredentials: true
      }).pipe(
      map(result => result.map(r => new PaymentMode(r))),
      catchError(e => observableThrowError(e))
    );
  }

}
