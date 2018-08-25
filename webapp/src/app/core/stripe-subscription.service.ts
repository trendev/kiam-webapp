import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class StripeSubscriptionService {

  readonly api = `${environment.api}/StripeSubscription`;

  constructor(private http: HttpClient) { }

  subscription(source: any): Observable<string> {
    // const payload = {
    //   newpassword: password
    // };

    return this.http.put<any>(`${this.api}/std-subscription`,
      source,
      { withCredentials: true })
      .pipe(
        // map(src => src),
        catchError(e => throwError(e))
      );
  }
}