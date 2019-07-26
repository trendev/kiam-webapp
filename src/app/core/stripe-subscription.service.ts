import { CoreModule } from './core.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: CoreModule
})
export class StripeSubscriptionService {

  readonly api = `${environment.api}/stipe-subscription`;

  constructor(private http: HttpClient) { }

  subscription(token: any): Observable<string> {
    return this.http.post<any>(`${this.api}/std-subscription`, token)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  details(): Observable<any> {
    return this.http.get<any>(`${this.api}/details`)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  invoices(): Observable<any> {
    return this.http.get<any>(`${this.api}/invoices`)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  rescind(): Observable<any> {
    return this.http.put<any>(`${this.api}/rescind`, null)
      .pipe(
        catchError(e => throwError(e))
      );
  }

  reactivate(): Observable<any> {
    return this.http.put<any>(`${this.api}/reactivate`, null)
      .pipe(
        catchError(e => throwError(e))
      );
  }
}
