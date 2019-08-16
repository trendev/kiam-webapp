import { Injectable } from '@angular/core';
import { CoreModule } from './core.module';
import { environment } from '@env/environment';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';

@Injectable({
  providedIn: CoreModule
})
export class UserAccountService {

  readonly api = `${environment.api}/user-account`;

  constructor(private http: HttpClient) { }

  createProfessional(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/create-professional`, payload)
      .pipe(
        catchError(e => throwError(e))
      );
  }
}
