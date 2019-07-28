import { CoreModule } from './core.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: CoreModule
})
export class StripePaymentMethodService {

  readonly api = `${environment.api}/stripe-payment-method`;

  constructor(private http: HttpClient) { }

  getPaymentMethods(): Observable<any> {
    return this.http.get<any>(`${this.api}`)
      .pipe(
        tap(pms => console.log(pms)),
        catchError(e => throwError(e))
      );
  }

  add(payload: any): Observable<any> {
    return this.http.put<any>(`${this.api}/add`, payload)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  default(id: string): Observable<any> {
    return this.http.put<any>(`${this.api}/default/${id}`, null)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  detach(id: string): Observable<any> {
    return this.http.put<any>(`${this.api}/detach/${id}`, null)
      .pipe(
        catchError(e => throwError(e))
      );
  }
}
