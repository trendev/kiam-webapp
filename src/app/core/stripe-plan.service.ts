import { CoreModule } from './core.module';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: CoreModule
})
export class StripePlanService {

  readonly api = `${environment.api}/stripe-plan`;

  constructor(private http: HttpClient) { }

  getPlans(): Observable<any> {
    return this.http.get<any>(`${this.api}`)
      .pipe(
        catchError(e => throwError(e))
      );
  }
}
