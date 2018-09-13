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

  readonly api = `${environment.api}/StripeSubscription`;

  constructor(private http: HttpClient) { }

  subscription(source: any): Observable<string> {
    return this.http.post<any>(`${this.api}/std-subscription`,
      source,
      { withCredentials: true })
      .pipe(
        catchError(e => throwError(e))
      );
  }

  details(): Observable<any> {
    return this.http.get<any>(`${this.api}/details`,
      { withCredentials: true })
      .pipe(
        catchError(e => throwError(e))
      );
  }

  addSource(source: any): Observable<any> {
    return this.http.put<any>(`${this.api}/add-source`,
      source,
      { withCredentials: true })
      .pipe(
        catchError(e => throwError(e))
      );
  }

  defaultSource(id: string) {
    return this.http.put<any>(`${this.api}/default_source/${id}`,
    null,
    { withCredentials: true })
    .pipe(
      catchError(e => throwError(e))
    );
  }

  detachSource(id: string) {
    return this.http.put<any>(`${this.api}/detach/${id}`,
    null,
    { withCredentials: true })
    .pipe(
      catchError(e => throwError(e))
    );
  }
}
