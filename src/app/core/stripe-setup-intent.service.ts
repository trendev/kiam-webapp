import { CoreModule } from './core.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: CoreModule
})
export class StripeSetupIntentService {

  readonly api = `${environment.api}/setup-intent`;

  constructor(private http: HttpClient) { }

  create(): Observable<any> {
    return this.http.get<any>(`${this.api}`)
      .pipe(
        catchError(e => throwError(e))
      );
  }
}
